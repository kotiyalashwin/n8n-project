"use client"
import {useRouter} from "next/navigation"

export const NewWorkFlow = ()=>{
    const router = useRouter();
    return <button onClick={()=>{
        const redirect = crypto.randomUUID()
        router.push(`/workflow/${redirect}`)
    }}>
        New +
    </button>
}