"use client"

export function ReloadPageButton() {
    function reload() {
        window.location.reload();
    }

    return (
        <button
            onClick={reload}
            className="btn btn-primary !px-8">Reload</button>
    )
}