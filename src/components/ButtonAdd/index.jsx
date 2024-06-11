import { BsCheckLg } from "react-icons/bs";

export function ButtonAdd({icon: Icon, title, add=false, ...rest}) {
    return (
        <div
            typeof="button"
            disabled={add}
            {...rest}

            className={`
                ${add ? 'bg-green-400' : 'bg-indigo-400'} 
                h-14
                cursor-pointer
                rounded-lg
                text-lg
                font-semibold
                flex
                items-center
                justify-center
                font-normal
                gap-2
            `}
                
            
        >   
            {Icon && add ? <BsCheckLg/> : <Icon/>}
            {add ? 'Caixa adicionada' : title}
        </div>
    )
}