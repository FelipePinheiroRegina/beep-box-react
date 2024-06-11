import { BsFillDoorClosedFill } from "react-icons/bs"

import { ButtonText } from "../ButtonText"
import { useAuth } from "../../hooks/auth"
export function Header() {
    const { logOut, userName } = useAuth()

    function handleExit() {
        logOut()
    }

    return (
        <header 
                className="
                bg-indigo-200
                absolute top-0 left-0 right-0 
                pt-4
                ">
            
            <div className="m-auto w-80 flex justify-between items-end">

                <div className="flex flex-col ">
                    <span className="text-slate-500">Bem-Vindo</span>
                    <strong className="ml-2">{userName}</strong>  
                </div>
            
                <ButtonText icon={BsFillDoorClosedFill} onClick={handleExit}/>
            </div>
        </header>
    )
}