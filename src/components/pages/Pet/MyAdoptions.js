import styles from './Dashboard.module.css'
import api from '../../../utils/api'
import { useState, useEffect } from 'react'
import RoundedImage from '../../layout/RoundedImage'
import { Link, useNavigate } from 'react-router-dom'


function MyAdoptions() {
    const [token] = useState(localStorage.getItem('token') || '')
    const [pets, setPets] = useState([])
    const [user, setUser] = useState([])
    const [currentUser, setCurrentUser] = useState([])
    const [allpets, setAllPets] = useState([])

    const navigate = useNavigate()
    
    useEffect(() => {
        api.get('/pets/myadoptions', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then(response => {
            setPets(response.data.pets)
        })
        
    }, [token])


    useEffect(() => {
        const fetchUsers = async () => {
            if (pets.length > 0) {
                const ids = pets.map((pet) => pet.ownerId)
                try {
                    const userPromises = ids.map((id) => api.get(`/users/${id}`))
                    const responseUsers = await Promise.all(userPromises)
                    const data = responseUsers.map((response) => response.data)
                    
                    setUser(data)
                    
                } catch (error) {
                    console.log(error)
                }
            }
            
            
        }

        fetchUsers()
        
    }, [pets])

    useEffect(() => {
        api.get('/users/checkuser', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then(response => {
            setCurrentUser(response.data)
        })

        api.get('/pets/mypets', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then(response => {
            setAllPets(response.data.pets)
        })

    }, [token])

    


    return(
        <section >
            <div className={styles.petlist_header}>
                <h1>Minhas Adocões</h1>
            </div>
            <div className={styles.petlist_container}>
                {pets.length > 0 &&
                    pets.map((pet) => (
                        <div className={styles.petlist_row} key={pet.id}>
                            <RoundedImage
                                src={`${process.env.REACT_APP_API_URL}/images/pets/${JSON.parse(pet.images)[0]}`}
                                alt={pet.name}
                                width="px75"
                            />
                            
                            <span className="bold">{pet.name}</span>
                            <div >
                                {user.length > 0 &&
                                    user.map((user) => (
                                        ((user.id === pet.ownerId) && (user.id !== currentUser.id)) && (
                                            <div className={styles.contacts} key={user.id}>
                                                <p>
                                                    Ligue para: <span>{user.phone}</span>
                                                </p>
                                                <p>
                                                    Fale com: <span>{user.name}</span>
                                                </p>
                                            </div>
                                        )
                                    ))
                                }
                            </div>
                            <div className={styles.actions}>
                                {pet.available && (
                                    <p>Adoção em andamento</p>
                                )}

                            </div>
                        </div>
                    ))
                }
                {allpets.length > 0 &&(
                    allpets.map((allpet) => (
                        (!allpet.available ) && (
                            <div className={styles.adoptions} key={allpet.id}>
                                <RoundedImage
                                    src={`${process.env.REACT_APP_API_URL}/images/pets/${JSON.parse(allpet.images)[0]}`}
                                    alt={allpet.name}
                                    width="px75"
                                />
                                <span className="bold">{allpet.name}</span>
                                <div className={styles.adoptions_actions}>
                                    <p>Adocão concluida!</p>
                                </div>
                            </div>
                        )
                    ))
                )}
                
                
                {((pets.length === 0)) && 
                <div className={styles.adotar}>
                    <p>Todas as adoções foram concluídas ou ainda não foram feitas. Adote um pet !</p>
                    <button onClick={() => navigate('/')}>Adotar</button>

                </div>
                }
            </div>

        </section>
    )
}

export default MyAdoptions