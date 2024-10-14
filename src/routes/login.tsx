import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { Error, Form, Input, PassReset, Switcher, Title, Wrapper } from '../components/auth-components';
import GithubButton from '../components/github-btn';

export default function Login() {
    const navigate = useNavigate();
    const [isLoding, setLoding] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value } } = e;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoding || email === "" || password === "") return;
        try {
            setLoding(true);
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (e) {
            if (e instanceof FirebaseError) {
                //console.log(e.code, e.message);
                setError(e.message);
            }
        } finally {
            setLoding(false);
        }

        //console.log(name, email, password);
    }

    return (
        <Wrapper>
            <Title>Log in 𝕏</Title>
            <Form onSubmit={onSubmit}>
                <Input onChange={onChange} name="email" placeholder="Email" type="email" required />
                <Input onChange={onChange} name="password" placeholder="Password" type="password" required />
                <Input onChange={onChange} type="submit" value={isLoding ? "Loding..." : "Log in"} />
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <PassReset>
                <a onClick={(e) => {
                    e.preventDefault();
                    if (email !== "") {
                        sendPasswordResetEmail(auth, email);
                        alert('Sent you an email, check it out');
                    } else {
                        alert('Please enter your email');
                        return;
                    }
                }}>Send a password reset email</a>
            </PassReset>
            <Switcher>
                Don't have an account? <Link to="/create-account">Create one &rarr;</Link>
            </Switcher>
            <GithubButton />
        </Wrapper>
    );
}