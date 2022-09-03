use schemars::JsonSchema;
use std::error::Error as StdError;
use std::{fmt, io};

#[derive(Serialize, JsonSchema)]
pub enum ErrorType {
    Io,
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
        Self {
            r#type: ErrorType::Io,
            message: error.to_string(),
        }
    }
}

pub type Result<T> = std::result::Result<T, Error>;
impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self.r#type {
            ErrorType::Io => write!(f, "Input output error"),
        }
    }
}

// Implement std::fmt::Debug for AppError
impl fmt::Debug for Error {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{{ file: {}, line: {} }}", file!(), line!()) // programmer-facing output
    }
}

impl StdError for Error {
    fn description(&self) -> &str {
        &self.message
    }
}
