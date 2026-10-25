use windows_sys::Win32::Foundation::{CloseHandle, HANDLE};
use windows_sys::Win32::System::Threading::{OpenProcess, PROCESS_TERMINATE, TerminateProcess};

pub fn kill_process(pid: u32) -> bool {
    unsafe {
        let access_rights: u32 = PROCESS_TERMINATE;
        let handle: HANDLE = OpenProcess(access_rights, 0, pid);

        if handle.is_null() {
            return false;
        }

        let success = TerminateProcess(handle, 1);

        CloseHandle(handle);

        success != 0
    }
}
