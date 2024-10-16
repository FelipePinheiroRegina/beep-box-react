export function ButtonText({icon: Icon, ...rest}) {
    return (
        <button {...rest} >
            {<Icon />}
        </button>
    )
}