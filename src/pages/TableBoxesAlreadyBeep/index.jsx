import { BsArrowLeft } from "react-icons/bs";

import { Header } from "../../components/Header"
import { ButtonText } from "../../components/ButtonText";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api"
import { useAuth } from "../../hooks/auth";

export function TableBoxesAlreadyBeep() {
    const accessToken = localStorage.getItem('@patralbeep:accessToken')
    
    const filial          = localStorage.getItem('@patralbeep:filial')
    const saleId          = localStorage.getItem('@patralbeep:idtoboxesbeep')
    const customerName    = localStorage.getItem('@patralbeep:nametoboxesbeep')

    const [ detailsBox, setDetailsBox ] = useState([])

    const navigate = useNavigate()

    function handleBack() {
        navigate(-1)
    }

    useEffect(() => {
        async function fetchBoxesAlreadyBeep() {
            try {
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
                
                const response = await api.get(`/zWsTransport/get_checks?company_id=${filial}&id=${saleId}`)
                
                setDetailsBox(response.data.objects)

            } catch (error) {
                return alert(error.response.data.error)
            }
        }

        fetchBoxesAlreadyBeep()
    }, [])

    return (
        <main className="w-full mt-24 lg:mt-40">
            <Header/>

            <section className="w-80 m-auto lg:w-1/3">
                
                <div className="flex justify-between mb-3">
                    <h1 className="text-slate-500 lg:text-xl">Pedido</h1> 
                    <ButtonText icon={BsArrowLeft} onClick={handleBack} className="lg:text-3xl"/>
                </div>
                
                <p  className="pl-4 text-lg lg:text-2xl">{customerName}</p>
                <p  className="pl-4 mb-5 text-lg border-b-2 border-indigo-200 lg:text-2xl">{saleId}</p>

                <div className="overflow-auto mb-2">
                    <table className="w-full text-left lg:text-xl">
                        <thead>
                            <tr>
                                <th>
                                    Caixa
                                </th>

                                <th>
                                    Hora
                                </th>

                                <th>
                                    Conferente
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            { detailsBox && detailsBox.map((box, index) => {
                                const isOdd = index % 2 !== 1;

                                return (
                                    <tr key={String(index)}
                                        className={isOdd ? "bg-indigo-200" : "bg-stone-50"}
                                    >
                                        <td>{
                                            box.box_id.length > 8 ? 
                                                box.box_id.slice(7) 
                                                :  
                                                0 + box.box_id.slice(7)}
                                        </td>
                                        
                                        <td>{box.checked_time}</td>
                                        <td>{box.user_name}</td>
                                    </tr>
                                 ) 
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    )
}