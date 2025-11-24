import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom"

import axios from 'axios';  
import axiosInstance from '../../axiosInstance';

import Frame from '../../components/Frame';
import ErrorFrame from '../../components/ErrorFrame';
import LoadingFrame from '../../components/LoadingFrame';

import TopCenter from '../../layout/TopCenter';
import CenterCenter from '../../layout/CenterCenter';

import Input from '../../components/Input';
import Pagination from '../../components/Pagination';

import {Plus,MoveDown,MoveUp,X,Search } from 'lucide-react';

const MyCurrenciesAdd = () => {

    useEffect(() => {
    }, );

    return (
    <>
        <TopCenter>
            <div>Add FORM</div>
        </TopCenter>
    </>
    );
};

export default MyCurrenciesAdd;