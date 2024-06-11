export function ButtonText({icon: Icon, ...rest}) {
    return (
        <button {...rest} >
            {<Icon size={20}/>}
        </button>
    )
}