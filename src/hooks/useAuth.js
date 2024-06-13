import api from "../utils/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFlashMessage from "./useFlashMessage";
export default function useAuth() {
    const [authenticated, setAuthenticated] = useState(false)
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'))
        if(token) {
            api.defaults.headers.Authorization = `Bearer ${token}`
            setAuthenticated(true)
        }
    }, [])

    async function register(user) {
        
        let msgText = 'Cadastro realizado com sucesso!'
        let msgType = 'success'
        

        try {
            const data = await api.post('/users/register', user).then((response) => {
                return response.data
            })
            await authUser(data)
        } catch(error) {
            msgText = error.response.data.message
            msgType = 'error'
        }

        setFlashMessage(msgText, msgType)
    }


    async function login(user) {
        let msgText = 'Login efetuado com sucesso!'
        let msgType = 'success'

        try {
            const data = await api.post('/users/login', user).then((response) => {
                return response.data
            })
            await authUser(data)
        } catch(error) {
            msgText = error.response.data.message
            msgType = 'error'
        }

        setFlashMessage(msgText, msgType)
    }

    async function authUser(data){
        setAuthenticated(true)
        localStorage.setItem('token', JSON.stringify(data.token))

        navigate('/')
    }

    async function logout() {
        const msgText = 'Saiu da sua conta com sucesso!'
        const msgType = 'success'
        setAuthenticated(false)
        localStorage.removeItem('token')
        api.defaults.headers.Authorization = undefined
        navigate('/')
        setFlashMessage(msgText, msgType)
    }

    return {authenticated, register, logout, login}
}
