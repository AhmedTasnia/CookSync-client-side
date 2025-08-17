import React from 'react';
import NavBar from '../Components/Header/Navbar';
import { Outlet } from 'react-router';
import Footer from '../Components/Footer/Footer';
import ThemeProvider from '../ThemeProvider';

const HomeLayout = () => {
    return (
        <>
            <ThemeProvider />
            <NavBar> </NavBar>
            <Outlet> </Outlet>
            <Footer> </Footer>
        </>
    );
};

export default HomeLayout;