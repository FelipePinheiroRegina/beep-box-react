import { BsFillBuildingsFill, BsCalendarWeekFill, BsFillDoorClosedFill } from "react-icons/bs"
import { FaTruckMoving } from "react-icons/fa"

import { Input  } from "../../components/Input"
import { Select } from "../../components/Select"
import { Button } from "../../components/Button"
import { Header } from "../../components/Header"
import { api    } from "../../services/api"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/auth"

export function Transports() {
    const accessToken = localStorage.getItem('@patralbeep:accessToken')

    const [ filial, setFilial ] = useState('0101')
    const [ date, setDate ] = useState('')
    const [ transports, setTransports ] = useState([])
    const [ chosenTransport, setChosenTransport ] = useState([])
    const navigate = useNavigate()
    
    useEffect(() => {
        async function handleChoseDateAndFilial() {
            try {
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

                const response = await api.get(`/zWsTransport/get_list?company_id=${filial}&date_ref=${date}`)

                setTransports(response.data.objects)
            } catch (error) {
                return alert(error.response.data.error)
            }  
        }

        if(date !== '') {
            handleChoseDateAndFilial()
        } else {
            setTransports([])
        }

    }, [date, filial])

    function handleClickSearch() {
        if(transports.length == 0 || chosenTransport.length == 0) {
            return alert('Escolha uma data e selecione a transportadora!')
        } 
        
        let transportName = transports.find(transport => transport.id == chosenTransport)
        transportName = transportName.name

        localStorage.setItem('@patralbeep:filial', filial)
        localStorage.setItem('@patralbeep:date', date)
        localStorage.setItem('@patralbeep:chosentransport', chosenTransport)
        localStorage.setItem('@patralbeep:transportname', transportName)
        navigate(`/tableTransport`)
    }
    
    return (
        <main className="w-full  h-screen flex">
            <Header/>

            <form 
                className="w-80 m-auto flex flex-col gap-4

                           lg:w-1/3                  
                ">

               <p className="text-right text-xl lg:text-3xl"> Buscar por transportadoras</p>

               <Select 
                    icon={BsFillBuildingsFill} 
                    placeholder="Filial" 
                    onChange={e => setFilial(e.target.value)}
                />

                <Input 
                    type="date"
                    icon={BsCalendarWeekFill} 
                    placeholder="Data" 
                    onChange={e => setDate(e.target.value)}
                />

                { transports.length > 0 && (
                    <div>
                        <Input 
                                onChange={e => setChosenTransport(e.target.value)}
                                list="transports" 
                                autoComplete="off" 
                                placeholder="Transportadoras" 
                        />

                        <datalist id="transports">
                            {transports.map((transport) => (
                            <option key={transport.id} value={transport.id}>
                                {transport.name}
                            </option>
                            ))}
                        </datalist>
                    </div>
                    )
                }
                
                <Button
                    onClick={handleClickSearch}
                    title="Buscar" 
                    loading={transports.length === 0}
                />
            </form>
        </main>
    )
}