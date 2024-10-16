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

                lg:pt-12
                ">
            
                <div 
                    className="
                    m-auto w-80 flex justify-between items-end 

                    lg:w-3/4
                ">

                <div 
                    className="
                    flex flex-col ">

                    <span className="text-slate-500 lg:text-xl">Bem-Vindo</span>
                    <strong className="ml-2 lg:text-2xl">{userName}</strong>  
                </div>
                
                <ButtonText icon={BsFillDoorClosedFill} onClick={handleExit} className="lg:text-2xl text-xl"/>
            </div>
        </header>
    )
}