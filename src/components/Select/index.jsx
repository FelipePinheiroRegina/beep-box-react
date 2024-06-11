export function Select({icon: Icon, ...rest}) {
    return (
        <div
            className="
                bg-indigo-200 border-b-4 border-indigo-400 
                flex items-center
                rounded-lg  
                w-full h-14 
                p-2
            " 
        >
           {Icon && <Icon size={20}/>}

           <select
                className="
                    outline-none 
                    w-full
                    bg-transparent
                    text-lg 
                    p-2
                " 
                {...rest} 
           >
                <option value="0101">Bauru</option>
                <option value="0201">Curitiba</option>
                <option value="0301">Minas</option>
            </select> 
        </div>
    )
}