use std::mem;
use windows_sys::Win32::Foundation::{CloseHandle, HANDLE};
use windows_sys::Win32::System::ProcessStatus::{GetProcessMemoryInfo, PROCESS_MEMORY_COUNTERS};
use windows_sys::Win32::System::Threading::{
    OpenProcess, PROCESS_QUERY_INFORMATION, PROCESS_VM_READ, QueryFullProcessImageNameW,
};

use crate::models::ProcessInfo;

pub fn get_process_info(pid: u32, process_name: &str) -> Option<ProcessInfo> {
    unsafe {
        let access_rights: u32 = PROCESS_QUERY_INFORMATION | PROCESS_VM_READ;
        let handle: HANDLE = OpenProcess(access_rights, 0, pid);

        if handle.is_null() {
            return None; // if access denied return none
        }

        // Get the path
        let mut path_buffer: [u16; 1024] = [0; 1024];
        let mut buffer_size: u32 = path_buffer.len() as u32;
        let mut final_path = String::from("Path Unknown"); // Default value

        let path_success =
            QueryFullProcessImageNameW(handle, 0, path_buffer.as_mut_ptr(), &mut buffer_size);
        if path_success != 0 {
            final_path = String::from_utf16_lossy(&path_buffer[..buffer_size as usize]);
        }

        // Get Ram Usage
        let mut mem_counters: PROCESS_MEMORY_COUNTERS = mem::zeroed();
        mem_counters.cb = mem::size_of::<PROCESS_MEMORY_COUNTERS>() as u32;
        let mut final_ram_mb: usize = 0; // Default value

        if GetProcessMemoryInfo(handle, &mut mem_counters, mem_counters.cb) != 0 {
            final_ram_mb = mem_counters.WorkingSetSize / (1024 * 1024);
        }

        CloseHandle(handle);

        Some(ProcessInfo {
            pid,
            name: process_name.to_string(),
            path: final_path,
            ram_usage_mb: final_ram_mb,
        })
    }
}
