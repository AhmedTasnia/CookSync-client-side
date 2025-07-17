import React from 'react';
import Navbar from '../../Header/Navbar';
import Banner from '../../Banner/Banner';
import AboutUs from '../../AboutUs/AboutUs';
import Footer from '../../Footer/Footer';
import FeaturePage from '../../featurePage/FeaturePage';
import MembershipCard from '../../MembershipCard/MembershipCard';
const Root = () => {
    
    return (
        <div>
            <Navbar> </Navbar>
            <Banner> </Banner>
            <AboutUs> </AboutUs>
            <FeaturePage> </FeaturePage>
            <MembershipCard> </MembershipCard>
            <Footer> </Footer>
        </div>
    );
};

export default Root;