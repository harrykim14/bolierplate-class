import React from 'react'
import { Link } from 'react-router-dom';
import './style.css';

function RegisterPage() {
    return (
    <div className="regist">
        <h2>Register</h2>

        <form>
            <label>Email</label>
            <input name="email" type="email" />

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
