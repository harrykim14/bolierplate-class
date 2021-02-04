import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import firebase from '../../firebase';
import './style.css';

function LoginPage() {

    const { register, errors, handleSubmit } = useForm();
    const [errorFromSubmit, setErrorFromSubmit] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        try {
            setLoading(true)

            await firebase.auth().signInWithEmailAndPassword(data.email, data.password);

            setLoading(false)

        } catch (error) {
            setErrorFromSubmit(error.message)
            setLoading(false)
            setTimeout(() => {
                setErrorFromSubmit('')
            }, 5000)
        }
    }


    return (
    <div className="login">
        <h2>Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
            <label>Email</label>
            <input name="email" type="email" 
                   ref={register({required: true, pattern: /^\S+@\S+$/i })}
            />
            {errors.email && <p>이 항목은 필수항목입니다.</p>}

            <label>Password</label>
            <input name="password" type="password"
                   ref={register({required:true, minLength:6})}
            />
            {errors.password && errors.password.type === "required" && <p>이 항목은 필수항목입니다.</p>}
            {errors.password && errors.password.type === "minLength" && <p>이름은 최소 6자리 이상이어야 합니다.</p>}

            {errorFromSubmit && <p style={{color:'red'}}>{errorFromSubmit}</p>}
            <input type="submit" disabled={loading}/>

            <Link style={{ color:'gray', textDecoration:"none" }} to="/regist">아직 아이디가 없다면...</Link>
        </form>
    </div>
    )
}

export default LoginPage
