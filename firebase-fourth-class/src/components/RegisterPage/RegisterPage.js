import React from 'react'
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './style.css';

function RegisterPage() {

    const { register, watch, errors } = useForm();

    console.log(watch("email"))

    return (
    <div className="regist">
        <h2>Register</h2>

        <form>
            <label>Email</label>
            <input name="email" type="email" 
                   ref={register({required: true, maxLength: 10})}
            />
            {errors.email && <p>이 항목은 필수항목입니다.</p>}

            <label>Name</label>
            <input name="name" />

            <label>Password</label>
            <input name="password" type="password" />

            <label>Password Confirm</label>
            <input name="password confirm" type="password" />

            <input type="submit" />

            <Link style={{ color:'gray', textDecoration:"none" }} to="/login">이미 아이디가 있다면...</Link>
        </form>
    </div>
    )
}

export default RegisterPage
