import { Suspense } from "react"
import StaffSchedulingPageMain from "./Main"

export default function Page() {
    return (
        <Suspense>
            <StaffSchedulingPageMain />
        </Suspense>
    )
}