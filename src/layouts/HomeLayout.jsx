import React from 'react';
import NavBar from '../Components/Header/Navbar';
import { Outlet } from 'react-router';
import Footer from '../Components/Footer/Footer';

const HomeLayout = () => {
    return (
        <>
            <NavBar> </NavBar>
            <Outlet> </Outlet>
            <Footer> </Footer>
        </>
    );
};

export default HomeLayout;