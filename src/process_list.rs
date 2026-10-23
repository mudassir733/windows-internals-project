use std::ffi::CStr;
use std::mem;
use windows_sys::Win32::Foundation::{CloseHandle, HANDLE, INVALID_HANDLE_VALUE};
use windows_sys::Win32::System::Diagnostics::ToolHelp::{
    CreateToolhelp32Snapshot, PROCESSENTRY32, Process32First, Process32Next, TH32CS_SNAPPROCESS,
};

use crate::models::ProcessListItem;

#[allow(dead_code)]
pub fn print_all_processes() {
    println!("\n=== LIST OF ALL SYSTEM PROCESSES ===\n");

    unsafe {
        let flags: u32 = TH32CS_SNAPPROCESS;

        let snapshot: HANDLE = CreateToolhelp32Snapshot(flags, 0);

        // if snapshot is invalid, return error
        if snapshot == INVALID_HANDLE_VALUE {
            println!("Failed to create process snapshot.");
            return;
        }

        // store the data in empty structure
        let mut entry: PROCESSENTRY32 = mem::zeroed();
        entry.dwSize = mem::size_of::<PROCESSENTRY32>() as u32;

        // get first 3 processes in the snapshot
        let mut success: i32 = Process32First(snapshot, &mut entry);

        println!(
            "{:<10} {:<30} {:<10}",
            "PID", "Process Name", "Thread Count"
        );
        println!("---------------------------------------------------------");

        while success != 0 {
            let pid: i32 = entry.th32ProcessID as i32;

            // szExeFile is a C string convert it to a Rust string
            let c_str = CStr::from_ptr(entry.szExeFile.as_ptr() as *const i8);

            let process_name = c_str.to_string_lossy();
            println!("{:<10} | {}", pid, process_name);

            // to ge the next process if next is 1 it will return if otherwise it will 0
            success = Process32Next(snapshot, &mut entry)
        }

        // protect from memory leak close the handle
        CloseHandle(snapshot);
    }
}

pub fn find_pid_by_name(target_name: &str) -> Option<u32> {
    unsafe {
        let snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);

        if snapshot == INVALID_HANDLE_VALUE {
            return None;
        }
        let mut entry: PROCESSENTRY32 = mem::zeroed();
        entry.dwSize = mem::size_of::<PROCESSENTRY32>() as u32;

        let mut success = Process32First(snapshot, &mut entry);
        while success != 0 {
            let c_str = CStr::from_ptr(entry.szExeFile.as_ptr() as *const i8);
            let process_name = c_str.to_string_lossy();

            if process_name.eq_ignore_ascii_case(target_name) {
                CloseHandle(snapshot);
                return Some(entry.th32ProcessID);
            }

            success = Process32Next(snapshot, &mut entry);
        }
        CloseHandle(snapshot);
        None
    }
}

pub fn get_all_processes_list() -> Vec<ProcessListItem> {
    // created empty Vec array
    let mut list: Vec<ProcessListItem> = Vec::new();
    unsafe {
        let snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
        if snapshot == INVALID_HANDLE_VALUE {
            return list; // if fail return empty
        }

        let mut entry: PROCESSENTRY32 = mem::zeroed();
        entry.dwSize = mem::size_of::<PROCESSENTRY32>() as u32;

        let mut success = Process32First(snapshot, &mut entry);

        while success != 0 {
            let pid = entry.th32ProcessID;
            let c_str = CStr::from_ptr(entry.szExeFile.as_ptr() as *const i8);
            let process_name = c_str.to_string_lossy().to_string();

            list.push(ProcessListItem {
                pid,
                name: process_name,
            });

            success = Process32Next(snapshot, &mut entry);
        }

        CloseHandle(snapshot);
    }

    list
}
