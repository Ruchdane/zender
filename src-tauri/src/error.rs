use libp2p::swarm::DialError;
use libp2p::TransportError;
use schemars::JsonSchema;
use std::error::Error as StdError;
use std::io::ErrorKind;
use std::{fmt, io};

#[derive(Serialize, JsonSchema)]
pub enum ErrorType {
    Io,
    IoNotFound,
    WrongMessage,
    ConnectionRefused,
    P2pAddr,
    Dial,
    P2pTransport,
}

use serde::Serialize;
#[derive(Serialize, JsonSchema)]
pub struct Error {
    r#type: ErrorType,
    message: String,
}

impl Error {
    pub fn new(r#type: ErrorType, message: String) -> Self {
        Self { r#type, message }
    }
}

impl From<io::Error> for Error {
    fn from(error: io::Error) -> Self {
        Self::new(
            match error.kind() {
                ErrorKind::NotFound => ErrorType::IoNotFound,
                _ => ErrorType::Io,
            },
            error.to_string(),
        )
    }
}

impl From<libp2p::multiaddr::Error> for Error {
    fn from(error: libp2p::multiaddr::Error) -> Self {
        // TODO proper implementation
        Self::new(ErrorType::P2pAddr, "Error parsing address".to_string())
    }
}

impl From<DialError> for Error {
    fn from(error: DialError) -> Self {
        // TODO proper implementation
        Self::new(ErrorType::Dial, "error dialing address".to_string())
    }
}

impl From<libp2p::TransportError<std::io::Error>> for Error {
    fn from(error: libp2p::TransportError<std::io::Error>) -> Self {
        // TODO proper implementation
        match error {
            TransportError::MultiaddrNotSupported(addr) => {
                Self::new(ErrorType::P2pTransport, format!("{} not supported", addr))
            }
            TransportError::Other(err) => err.into(),
        }
    }
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self.r#type {
            ErrorType::Io => write!(f, "Input output error"),
            ErrorType::IoNotFound => write!(f, "File or folder not found"),
            ErrorType::WrongMessage => write!(f, "Wrog message type"),
            ErrorType::ConnectionRefused => write!(f, "ConnectionRefused"),
            ErrorType::P2pAddr => write!(f, "Libp2pAddrError"),
            ErrorType::Dial => write!(f, "DialError"),
            ErrorType::P2pTransport => write!(f, "Error de transport"),
        }
    }
}

pub type Result<T> = std::result::Result<T, Error>;
// Implement std::fmt::Debug for AppError
impl fmt::Debug for Error {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{{ [{}] file: {}, line: {} }}",self, file!(), line!()) // programmer-facing output
    }
}

impl StdError for Error {
    fn description(&self) -> &str {
        &self.message
    }
}
