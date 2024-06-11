export function Input({icon: Icon, ...rest}) {
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

            <input
                className="
                    outline-none 
                    w-full
                    bg-transparent
                    text-lg 
                    p-2
                " 
                {...rest}
            />
        </div>    
    )
}