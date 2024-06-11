export function Button({icon: Icon, title, loading=false, ...rest}) {
    return (
        <div
            typeof="button"
            disabled={loading}
            {...rest}

            className="
                bg-indigo-400 
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
            "
        >   
            {Icon && <Icon/>}
            {loading ? 'Carregando...' : title}
        </div>
    )
}