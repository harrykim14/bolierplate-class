import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import firebase from '../../firebase';
import md5 from 'md5';
import './style.css';

function RegisterPage() {

    const { register, watch, errors, handleSubmit } = useForm();
    const [errorFromSubmit, setErrorFromSubmit] = useState('');
    const [loading, setLoading] = useState(false);
    const password = useRef();
    password.current = watch("password");
    console.log(watch("email"))

    const onSubmit = async (data) => {
        try {
            setLoading(true)

            let createUser = await firebase.auth().createUserWithEmailAndPassword(data.email,data.password)
            console.log("createUser", createUser);

            await createUser.user.updateProfile({
                displayName: data.name,
                photoURL:`http://gravatar.com/avatar/${md5(createUser.user.email)}?d=identicon`
            })

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
    <div className="regist">
        <h2>Register</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
            <label>Email</label>
            <input name="email" type="email" 
                   ref={register({required: true, pattern: /^\S+@\S+$/i })}
            />
            {errors.email && <p>이 항목은 필수항목입니다.</p>}

            <label>Name</label>
            <input name="name" 
                   ref={register({required: true, maxLength:10 })}
            />
            {errors.name && errors.name.type === "required" && <p>이 항목은 필수항목입니다.</p>}
            {errors.name && errors.name.type === "maxLength" && <p>이름은 최대 10자리까지만 작성이 가능합니다.</p>}

            <label>Password</label>
            <input name="password" type="password"
                   ref={register({required:true, minLength:6})}
            />
            {errors.password && errors.password.type === "required" && <p>이 항목은 필수항목입니다.</p>}
            {errors.password && errors.password.type === "minLength" && <p>이름은 최소 6자리 이상이어야 합니다.</p>}

            <label>Password Confirm</label>
            <input name="passwordConfirm" type="password" 
                   ref={register({required: true, validate: (value) => value === password.current})}
            />
            {errors.passwordConfirm && errors.passwordConfirm.type === "required" && <p>이 항목은 필수항목입니다.</p>}
            {errors.passwordConfirm && errors.passwordConfirm.type === "validate" && <p>입력하신 비밀번호와 다릅니다.</p>}


            {errorFromSubmit && <p style={{color:'red'}}>{errorFromSubmit}</p>}
            <input type="submit" disabled={loading}/>

            <Link style={{ color:'gray', textDecoration:"none" }} to="/login">이미 아이디가 있다면...</Link>
        </form>
    </div>
    )
}

export default RegisterPage
