import { useEffect, useState } from 'react';
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

import axiosInstance from '../../axiosInstance';

import Frame from '../../components/Frame';

import LoadingFrame from '../../components/LoadingFrame';

import TopCenter from '../../layout/TopCenter';
import CenterCenter from '../../layout/CenterCenter';

import Button from '../../components/Button';

const MyCurrenciesAdd = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const id = location.pathname.split("/").pop();

    const [transaction,setTransaction] = useState(null);
    const [errors, setErrors] = useState();

    const fetch = async () => {
        try {
            const response = await axiosInstance.get('/user_transaction/'+id)
            setTransaction(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetch();
    },[]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.delete('/user_transaction/'+id+'/');
            navigate('/myCurrencies');
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    return (
    <>
        {transaction ?   (
            <TopCenter>
                <Frame>
                    <form onSubmit={handleSubmit} >
                        <h2 className='text-center p-6 text-3xl'>Czy na pewno chcesz usunąć wpis ?</h2>
                        <div>
                            <div>Zmiana: {transaction.amount}</div>
                            <div>Waluta: {transaction.currency.name}</div>
                            <div>Kod Waluty: {transaction.currency.code}</div>
                            <div>Data: {new Date(transaction.created_at).toLocaleString("pl-PL")}</div>
                        </div>
                        <>
                            {errors && (
                                <>
                                    <div className="text-red-600 m-2 text-center text-sm">Bład</div>
                                </>
                            )}
                        </>
                        <div className='flex p-6 justify-center'>
                            <Button type = "submit" className='me-2'>Usuń</Button>
                            <Button><Link to={`/myCurrencies`}>Anuluj</Link></Button>
                        </div>
                    </form>
                </Frame>
            </TopCenter>
        ):(
            <CenterCenter>
                <LoadingFrame/>
            </CenterCenter>
        )}
    </>
    );
};

export default MyCurrenciesAdd;