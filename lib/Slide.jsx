export default ({ children, ...props }) => {
    return (
        <div className="slide" {...props}>
            {children}
        </div>
    )
}
