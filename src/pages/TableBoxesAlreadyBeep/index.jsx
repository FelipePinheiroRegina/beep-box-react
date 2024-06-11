import { BsArrowLeft } from "react-icons/bs";

import { Header } from "../../components/Header"
import { ButtonText } from "../../components/ButtonText";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api"

export function TableBoxesAlreadyBeep() {
    const filial          = localStorage.getItem('@patralbeep:filial')
    const saleId          = localStorage.getItem('@patralbeep:idtoboxesbeep')
    const customerName    = localStorage.getItem('@patralbeep:nametoboxesbeep')
    const accessToken     = localStorage.getItem('@patralbeep:access_token')

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
                console.log(error.response)
                //return alert(error.response.data.error)
            }
        }

        fetchBoxesAlreadyBeep()
    }, [])

    return (
        <main className="w-full mt-24">
            <Header/>

            <section className="w-80 m-auto">
                
                <div className="flex justify-between mb-3">
                    <h1 className="text-slate-500">Pedido</h1> 
                    <ButtonText icon={BsArrowLeft} onClick={handleBack}/>
                </div>
                
                <p  className="pl-4 text-lg">{customerName}</p>
                <p  className="pl-4 mb-5 text-lg border-b-2 border-indigo-200">{saleId}</p>

                <div className="overflow-auto mb-2">
                    <table className="w-full text-left ">
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
                            { detailsBox && detailsBox.map((box, index) => (
                                    <tr key={String(index)}>

                                        <td>{
                                            box.box_id.length > 8 ? 
                                                box.box_id.slice(7) 
                                                :  
                                                0 + box.box_id.slice(7)}
                                        </td>
                                        
                                        <td>{box.checked_time}</td>
                                        <td>{box.user_name}</td>

                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    )
}