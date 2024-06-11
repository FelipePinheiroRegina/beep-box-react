import { Html5Qrcode } from "html5-qrcode";
import { BsArrowLeft, BsTrash3, BsSearch, BsFillBoxFill, BsQrCodeScan, BsXLg } from "react-icons/bs";
import { Header } from "../../components/Header";
import { ButtonText } from "../../components/ButtonText";
import { ButtonAdd } from "../../components/ButtonAdd";
import { Input } from "../../components/Input";
import { useAuth } from "../../hooks/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../services/api";

export function TableTransport() {
    const { userName } = useAuth();
    const navigate = useNavigate();
    const [addBox, setAddBox] = useState('');
    const [orders, setOrders] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [watchAddBox, setWatchAddBox] = useState(false);
    

    const transportName = localStorage.getItem('@patralbeep:transportname');
    const filial = localStorage.getItem('@patralbeep:filial');
    const date = localStorage.getItem('@patralbeep:date');
    const chosenTransport = localStorage.getItem('@patralbeep:chosentransport');
    const accessToken = localStorage.getItem('@patralbeep:access_token');
    const formattedDate = date.split('-').reverse().join('/');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [html5QrCode, setHtml5QrCode] = useState(null);

    function handleBack() {
        navigate(-1);
    }

    const triggerWatchAddBox = () => {
        setWatchAddBox(true);
    
        setTimeout(() => {
            setWatchAddBox(false)
        }, 1500);
    }

    async function handleAddBox() {
        if (!addBox) {
            return alert('Coloque o código-caixa do pedido antes de clicar em adicionar!. Ex.: 445234-1')
        }
    
        let updatedAddBox = addBox
    
        if (addBox.length === 14) {
            const idOrder = addBox.slice(4, 10)
            const box = addBox.slice(-2)
            updatedAddBox = idOrder + '-' + box
            setAddBox(updatedAddBox)
        }
    
        const idOrder = updatedAddBox.slice(0, 6)
        const box = Number(updatedAddBox.slice(7))
        console.log(updatedAddBox)
        const order = orders.find(order => order.sale_id == idOrder);
    
        if (!order) {
            setAddBox('')
            return alert('Pedido não encontrado')
        }
    
        if (box > order.box_qty || box <= 0) {
            setAddBox('')
            return alert('Esta caixa não existe')
        }
    
        try {
            await api.post(`/zWsTransport/new_check?company_id=${filial}&id=${updatedAddBox}&user_login=${userName}`);
            setRefresh(prev => !prev);
            triggerWatchAddBox();
            setAddBox('')
        } catch (error) {
            setAddBox('')
            return alert(error.response.data.error);
        }
    }
    

    async function handleDeleteBox(id, boxQtyChecked) {
        if (boxQtyChecked == 0) {
            return alert('Não possui caixas para deletar');
        }

        const isTrue = confirm(`Deseja deletar todas as caixas do pedido ${id}?`);
        if (!isTrue) {
            return;
        }

        try {
            await api.delete(`/zWsTransport/delete_checks?company_id=${filial}&id=${id}`);
            setRefresh(prev => !prev);
        } catch (error) {
            return alert(error.response.data.error);
        }
    }

    function handleNavigateTableBoxesAlreadyBeep(saleId, customerName, boxQtyChecked) {
        if (boxQtyChecked == 0) {
            return alert('Não foi beepado nenhuma caixa deste pedido');
        }

        localStorage.setItem('@patralbeep:idtoboxesbeep', saleId);
        localStorage.setItem('@patralbeep:nametoboxesbeep', customerName);
        navigate('/TableBoxesAlreadyBeep');
    }

    function handleOpen() {
        setIsModalOpen(true);

        Html5Qrcode.getCameras().then(cameras => {
            if (cameras && cameras.length) {
                const backCamera = cameras.find(camera => 
                    camera.label.toLowerCase().includes('traseira') || 
                    camera.label.toLowerCase().includes('back')
                );

                const currentCameraId = backCamera ? backCamera.id : cameras[0].id;
                const html5QrCodeInstance = new Html5Qrcode("reader");

                html5QrCodeInstance.start(
                    currentCameraId, 
                    { fps: 10, qrbox: 250 }, 
                    (decodedText, decodedResult) => {
                        setAddBox(decodedText)
                        html5QrCodeInstance.stop();
                        setIsModalOpen(false);
                    }
                );

                setHtml5QrCode(html5QrCodeInstance);
            }
        });
    }

    function handleClose() {
        if (!isModalOpen) {
            return alert('A câmera já está fechada');
        }

        html5QrCode.stop();
        setIsModalOpen(false);
    }

    useEffect(() => {
        async function fetchOrders() {
            try {
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                const response = await api.get(`/zWsTransport/get_sales?company_id=${filial}&date_ref=${date}&id=${chosenTransport}`);
                setOrders(response.data.objects);
            } catch (error) {
                return alert(error);
            }
        }

        fetchOrders();
    }, [refresh]);

    return (
        <main className="w-full mt-24">
            <Header />

            {isModalOpen && (
                <div className="absolute inset-0 bg-gray-600 bg-opacity-50 ">
                    <div style={{ width: "320px" }} id="reader" className="z-10 m-auto"></div>    
                </div>
            )}

            <section className="w-80 m-auto">
                <div className="flex justify-between mb-3">
                    <h1 className="text-slate-500">Transportadora</h1>
                    <ButtonText icon={BsArrowLeft} onClick={handleBack} />
                </div>
                <p className="pl-4 text-lg">{transportName}</p>
                <p className="pl-4 mb-5 text-lg border-b-2 border-indigo-200">{formattedDate}</p>
                <div className="overflow-auto h-64 mb-2">
                    <table className="w-full text-left ">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Pedido</th>
                                <th>Qtd-Cx</th>
                                <th>Qtd-Cont</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders && orders.map((order, index) => (
                                <tr key={String(index)}>
                                    <td
                                        className="cursor-pointer"
                                        onClick={() =>
                                            handleNavigateTableBoxesAlreadyBeep(
                                                order.sale_id,
                                                order.customer_name,
                                                order.box_qty_checked
                                            )}
                                    >
                                        <BsSearch />
                                    </td>

                                    <td>{order.sale_id}</td>
                                    <td>{order.box_qty}</td>
                                    <td>{order.box_qty_checked}</td>

                                    <td
                                        className="cursor-pointer"
                                        onClick={() => handleDeleteBox(order.sale_id, order.box_qty_checked)}
                                    >
                                        <BsTrash3 />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex max-w-max self-end gap-4">
                        <ButtonText className="z-10" icon={BsXLg} onClick={handleClose}/>
                        <ButtonText icon={BsQrCodeScan} onClick={handleOpen}/>
                    </div>

                    <Input
                        onChange={e => setAddBox(e.target.value)}
                        icon={BsFillBoxFill}
                        placeholder="Pedido-Cx - (ex.: 443705-1)"
                        value={addBox}
                    />

                    <ButtonAdd
                        onClick={handleAddBox}
                        icon={BsFillBoxFill}
                        title="Adicionar"
                        add={watchAddBox}
                    />
                </div>
            </section>
        </main>
    );
}
