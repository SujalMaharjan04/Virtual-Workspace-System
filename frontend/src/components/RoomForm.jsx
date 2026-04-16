
const RoomForm = ({topic, name1,  label1, input1, error1,  input2, error2, handleInput, handleSubmit}) => {
    return (
        <div className = " flex flex-col items-center justify-center">
            <div>
                <h1 className = "text-5xl font-bold mb-6">{topic}</h1>
            </div>
            
            <div>
                <form onSubmit = {handleSubmit} className = "form">
                    <div className = "inputDivStyle">
                        <label htmlFor = {label1}>{label1}</label>
                        <input onChange = {handleInput} type = "text" name = {name1} className = "inputStyle" placeholder={`Enter ${label1}`} value = {input1} />
                        {error1 && (
                            <p className = "error">{error1}</p>
                        )}
                    </div>

                    <div className = "inputDivStyle">
                        <label htmlFor = "password">Password</label>
                        <input onChange = {handleInput} type = "password" name = "password" className = "inputStyle" placeholder = "Enter Your Password" value = {input2}  />
                        {error2 && (
                            <p className = "error">{error2}</p>
                        )}
                    </div>

                    <div className = "w-full flex justify-center items-center">
                        <button type = "submit" className = "submitBtn">{topic}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RoomForm