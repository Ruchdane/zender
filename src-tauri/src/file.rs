use std::path::Path;
use std::fs;
use std::time::SystemTime;


// Structure d'une 
#[derive(serde::Serialize, Clone, Debug)]
pub struct FileMetaData {
    file_path: String,
    basename: String,
    // file_type: String,
    is_dir: bool,
    is_file: bool,
    size: u64,
    last_modified: SystemTime,
    last_accessed: SystemTime,
    created: SystemTime,
    // icon: String,
}


#[derive(serde::Serialize)]
pub struct FolderInformation {
    number_of_files: u16,
    files: Vec<FileMetaData>
}
impl FileMetaData {
    pub async fn new(file_path: &str) ->  Result<FileMetaData, String> {
        let metadata = match fs::metadata(file_path) {
            Ok(result) => result,
            Err(e) => return Err(e.to_string()),
        };
    
        let last_modified = match metadata.modified() {
            Ok(result) => result,
            Err(e) => return Err(e.to_string()),
        };
    
        let last_accessed = match metadata.accessed() {
            Ok(result) => result,
            Err(e) => return Err(e.to_string()),
        };
    
        let created = match metadata.created() {
            Ok(result) => result,
            Err(e) => return Err(e.to_string()),
        };
    
        let is_dir = metadata.is_dir();
        let basename =  match Path::new(&file_path).file_name() {
            Some(basename) => basename.to_str().unwrap().to_string(),
            None => file_path.to_string(),
        };
        let size = match is_dir {
            true => 0,
            false => metadata.len()
        };
       
        Ok(FileMetaData {
            file_path: file_path.to_string(),
            basename,
            // file_type,
            is_dir: is_dir,
            is_file: metadata.is_file(),
            size,
            last_modified,
            last_accessed,
            created,
            // icon: "".to_string()
        })
    }
}

#[tauri::command]
pub async fn get_file_metadata(path: &str) -> Result<FileMetaData,String>{
    FileMetaData::new(path).await
}
