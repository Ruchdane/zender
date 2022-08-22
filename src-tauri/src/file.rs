// This is inspired from https://github.com/kimlimjustin/xplorer
// TODO See if it is necessary to switch to tokio
// TODO find a way to use osString
use crate::error::{Error, ErrorType, Result};
use serde::Serialize;
use std::ffi::OsString;
// use std::fs;
use std::io::Result as IoResult;
use std::path::Path;
use std::time::SystemTime;
use tokio::fs;

// INFO No recursion for the time being( item inside a folder)
/// Global "item" Information
#[derive(Debug, Serialize)]
pub struct Sysdata {
    path: String,
    basename: OsString,
    is_hidden: bool,
    //  TO not have to check the type when creating the metadata
    //  but the Information is redundant
    is_dir: bool,
    is_link: bool,
    created_at: Option<SystemTime>,
    last_modified: Option<SystemTime>,
    last_accessed: Option<SystemTime>,
}

impl Sysdata {
    /// Get metadata of a path
    /// Fail if :
    ///     - Path does not exist
    ///     - Path is not valid
    ///     - User do not have permision on this path
    async fn new(path: String) -> Result<Self> {
        let metadata = fs::metadata(&path).await?;
        let last_modified = metadata.modified().ok();
        let created_at = metadata.created().ok();
        let last_accessed = metadata.accessed().ok();
        let is_dir = metadata.is_dir();
        let is_link = util::is_link(&path).await?;
        let basename = match Path::new(&path).file_name() {
            Some(name) => name.to_os_string(),
            None => {
                return Err(Error::new(
                    ErrorType::Io,
                    "Path is terminated with ..".to_string(),
                ));
            }
        };
        let is_hidden = util::is_hidden(&basename, metadata);

        Ok(Self {
            path,
            basename,
            is_hidden,
            created_at,
            last_modified,
            last_accessed,
            // The fetched metadata is of the target
            // so the link to a dir is a 'dir' but not really
            is_dir: is_dir && !is_link,
            is_link,
        })
    }
}

/// Specifique Information about file
#[derive(Debug, Serialize)]
pub struct FileMetadata {
    r#type: String,
    size: u64,
    sysdata: Sysdata,
}

impl FileMetadata {
    /// Get metadata of a file
    /// Fail if :
    ///     - Path does not exist
    ///     - Path is not valid
    ///     - User do not have permision on this path
    pub async fn new(path: &str, sysdata: Option<Sysdata>) -> Result<Self> {
        let r#type = util::get_type(path);
        let size = fs::metadata(path).await?.len();
        let sysdata = match sysdata {
            Some(value) => value,
            None => Sysdata::new(path.to_string()).await?,
        };
        Ok(Self {
            r#type,
            size,
            sysdata,
        })
    }
}

/// Specifique Information about a folder
#[derive(Debug, Serialize)]
pub struct FolderMetadata {
    /// The count of everything that can be found inside
    children: Vec<String>,
    // Not sure if this wont be a problem
    // size: u64,
    sysdata: Sysdata,
}

impl FolderMetadata {
    /// Get metadata of a folder
    /// Fail if :
    ///     - Path does not exist
    ///     - Path is not a directory
    ///     - User do not have permision on this path
    pub async fn new(path: &str, sysdata: Option<Sysdata>) -> Result<Self> {
        // TODO find a way to get the children in an async way
        let mut children = std::fs::read_dir(path)?
            .map(|res| res.map(|e| e.path().to_string_lossy().to_string()))
            .collect::<IoResult<Vec<_>>>()?;

        children.sort();
        let sysdata = match sysdata {
            Some(value) => value,
            None => Sysdata::new(path.to_string()).await?,
        };

        Ok(Self { children, sysdata })
    }
}

/// Specifique Information about a link
#[derive(Debug, Serialize)]
pub struct LinkMetadata {
    path: String,
    sysdata: Sysdata,
}

impl LinkMetadata {
    /// Get metadata of a link
    /// Fail if :
    ///     - Path does not exist
    ///     - Path is not valid
    ///     - User do not have permision on this path
    pub async fn new(path: &str, sysdata: Option<Sysdata>) -> Result<Self> {
        let path = path.to_string();
        let sysdata = match sysdata {
            Some(value) => value,
            None => Sysdata::new(path.clone()).await?,
        };

        Ok(Self { path, sysdata })
    }
}

/// Information on everything that can be found on the disk

#[derive(Debug, Serialize)]
pub enum Metadata {
    File(FileMetadata),
    Folder(FolderMetadata),
    Link(LinkMetadata),
}

impl Metadata {
    pub async fn new(path: &str) -> Result<Self> {
        let sysdata = Sysdata::new(path.to_string()).await?;
        if sysdata.is_link {
            Ok(Metadata::Link(
                LinkMetadata::new(path, Some(sysdata)).await?,
            ))
        } else if sysdata.is_dir {
            Ok(Metadata::Folder(
                FolderMetadata::new(path, Some(sysdata)).await?,
            ))
        } else {
            Ok(Metadata::File(
                FileMetadata::new(path, Some(sysdata)).await?,
            ))
        }
    }
}

mod util {
    use super::*;
    use std::fs::Metadata;
    #[inline]
    pub fn get_type(filename: &str) -> String {
        mime_guess::from_path(filename)
            .first_raw()
            .unwrap_or("text/plain")
            .to_string()
    }

    pub async fn is_link(path: &String) -> Result<bool> {
        let path = Path::new(path);
        let metadata = fs::symlink_metadata(path).await?;
        Ok(metadata.is_symlink())
    }

    #[cfg(windows)]
    #[inline]
    pub fn is_hidden(_basename: &OsString, metadata: Metadata) -> bool {
        let attributes = metadata.file_attributes();
        (attributes & 0x2) > 0
    }

    /// Check if a file is hidden
    ///
    /// Checking a file is hidden by checking if the file name starts with a dot
    #[cfg(unix)]
    #[inline]
    pub fn is_hidden(basename: &OsString, _metadata: Metadata) -> bool {
        basename.to_string_lossy().starts_with('.')
    }
}

#[cfg(test)]
mod test {
    use std::fs;
    use std::fs::{DirBuilder, File};

    #[cfg(windows)]
    use std::os::windows::fs::{symlink_dir, symlink_file};

    #[cfg(unix)]
    use std::os::unix::fs::{symlink as symlink_file, symlink as symlink_dir};

    use super::*;
    use tempdir::TempDir;

    struct Context {
        dir: TempDir,
    }
    impl Context {
        fn new(name: &str) -> Self {
            let dir = TempDir::new(name).unwrap();
            Self { dir }
        }
    }

    #[tokio::test]
    async fn get_sysdata_of_file() {
        let ctx = Context::new("get_sysdata_of_file");
        let filename = "foo.txt";
        let filepath = ctx.dir.path().join(filename);
        File::create(filepath.clone()).unwrap();
        let sys = Sysdata::new(filepath.to_str().unwrap().to_string()).await;
        assert!(sys.is_ok());
        let sys = sys.unwrap();
        let meta = fs::metadata(filepath.clone()).unwrap();
        assert_eq!(sys.path, filepath.to_string_lossy());
        assert_eq!(sys.basename, filename);
        assert_eq!(sys.created_at, meta.created().ok());
        assert_eq!(sys.last_modified, meta.modified().ok());
        assert_eq!(sys.last_accessed, meta.accessed().ok());
        assert!(!sys.is_dir);
        assert!(!sys.is_link);
        assert!(!sys.is_hidden);
    }

    #[tokio::test]
    async fn get_metadata_of_file() {
        let ctx = Context::new("get_metadata_of_file");
        let filename = "foo.txt";
        let size = 100;
        let filepath = ctx.dir.path().join(filename);
        let file = File::create(filepath.clone()).unwrap();
        file.set_len(size).unwrap();
        let filedata = FileMetadata::new(filepath.to_str().unwrap(), None)
            .await
            .unwrap();
        assert_eq!(filedata.size, size);
        // No test for field type
    }

    #[tokio::test]
    async fn get_sysdata_of_link_to_a_file() {
        let ctx = Context::new("get_sysdata_of_link_to_a_file");
        let filename = "foo.txt";
        let link = "link_to_foo";
        let filepath = ctx.dir.path().join(filename);
        File::create(filepath.clone()).unwrap();
        let linkpath = ctx.dir.path().join(link);
        File::create(filepath.clone()).unwrap().metadata().unwrap();
        symlink_file(filepath, linkpath.clone()).unwrap();
        let meta = fs::metadata(linkpath.clone()).unwrap();
        let sys: Sysdata = Sysdata::new(linkpath.to_str().unwrap().to_string())
            .await
            .unwrap();
        assert_eq!(sys.path, linkpath.to_string_lossy());
        assert_eq!(sys.basename, link);
        assert_eq!(sys.created_at, meta.created().ok());
        assert_eq!(sys.last_modified, meta.modified().ok());
        assert_eq!(sys.last_accessed, meta.accessed().ok());
        assert!(!sys.is_dir);
        assert!(sys.is_link);
        assert!(!sys.is_hidden);
    }

    #[cfg(unix)]
    #[tokio::test]
    async fn get_sysdata_of_a_hidenn_file() {
        let ctx = Context::new("get_sysdata_of_a_hidenn_file");
        let filename = ".foo.txt";
        let filepath = ctx.dir.path().join(filename);
        File::create(filepath.clone()).unwrap();
        let meta = fs::metadata(filepath.clone()).unwrap();
        let sys: Sysdata = Sysdata::new(filepath.to_str().unwrap().to_string())
            .await
            .unwrap();
        assert_eq!(sys.path, filepath.to_string_lossy());
        assert_eq!(sys.basename, filename);
        assert_eq!(sys.created_at, meta.created().ok());
        assert_eq!(sys.last_modified, meta.modified().ok());
        assert_eq!(sys.last_accessed, meta.accessed().ok());
        assert!(!sys.is_dir);
        assert!(!sys.is_link);
        assert!(sys.is_hidden);
    }

    // TODO check link to a hiden file
    // TODO check hidden link to a hiden file
    // TODO check link to a hiden folder
    // TODO check hidden link to a hiden folder

    #[tokio::test]
    async fn get_sysdata_of_folder() {
        let ctx = Context::new("get_sysdata_of_folder");
        let filename = "foo";
        let path = ctx.dir.path().join(filename);
        DirBuilder::new()
            .recursive(true)
            .create(path.clone())
            .unwrap();
        let meta = fs::metadata(path.clone()).unwrap();
        let sys: Sysdata = Sysdata::new(path.to_str().unwrap().to_string())
            .await
            .unwrap();
        assert_eq!(sys.path, path.to_string_lossy());
        assert_eq!(sys.basename, filename);
        assert_eq!(sys.created_at, meta.created().ok());
        assert_eq!(sys.last_modified, meta.modified().ok());
        assert_eq!(sys.last_accessed, meta.accessed().ok());
        assert!(sys.is_dir);
        assert!(!sys.is_link);
        assert!(!sys.is_hidden);
    }

    #[tokio::test]
    async fn get_sysdata_of_link_to_a_folder() {
        let ctx = Context::new("get_sysdata_of_link_to_a_folder");
        let dirname = "foo.txt";
        let link = "link_to_foo";
        let dirpath = ctx.dir.path().join(dirname);
        let linkpath = ctx.dir.path().join(link);
        DirBuilder::new()
            .recursive(true)
            .create(dirpath.clone())
            .unwrap();
        symlink_dir(dirpath, linkpath.clone()).unwrap();
        let meta = fs::metadata(linkpath.clone()).unwrap();
        let sys: Sysdata = Sysdata::new(linkpath.to_str().unwrap().to_string())
            .await
            .unwrap();
        assert_eq!(sys.path, linkpath.to_string_lossy());
        assert_eq!(sys.basename, link);
        assert_eq!(sys.created_at, meta.created().ok());
        assert_eq!(sys.last_modified, meta.modified().ok());
        assert_eq!(sys.last_accessed, meta.accessed().ok());
        assert!(!sys.is_dir);
        assert!(sys.is_link);
        assert!(!sys.is_hidden);
    }

    #[tokio::test]
    async fn get_metadata_of_folder() {
        let ctx = Context::new("get_metadata_of_file");
        let count = 10;
        let dirname = "foo";
        let path = ctx.dir.path().join(dirname);
        DirBuilder::new()
            .recursive(true)
            .create(path.clone())
            .unwrap();
        let files: Vec<String> = (0..count)
            .map(|n| {
                path.join(format!("foo{}.txt", n))
                    .to_string_lossy()
                    .to_string()
            })
            .collect();
        for file in &files {
            File::create(file).unwrap();
        }

        let folderdata = FolderMetadata::new(path.to_str().unwrap(), None)
            .await
            .unwrap();
        assert_eq!(folderdata.children, files);
        // No test for field type
    }
}

#[tauri::command]
pub async fn get_sysdata_of_path(path: &str) -> Result<Sysdata> {
    Sysdata::new(path.to_string()).await
}
#[tauri::command]
pub async fn get_metadata_of_path(path: &str) -> Result<Metadata> {
    Metadata::new(path).await
}
