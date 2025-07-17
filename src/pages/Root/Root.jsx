import React from 'react';
import Navbar from '../../Components/Header/Navbar';
import Banner from '../../Components/Banner/Banner';
import AboutUs from '../../Components/AboutUs/AboutUs';
import Footer from '../../Components/Footer/Footer';
import FeaturePage from '../../Components/featurePage/FeaturePage';
import MembershipCard from '../../Components/MembershipCard/MembershipCard';
import MealByCategory from '../../Components/MealByCategory/MealByCategory';
const Root = () => {
    
    return (
        <div>
            <Banner> </Banner>
            <AboutUs> </AboutUs>
            <MealByCategory> </MealByCategory>
            <FeaturePage> </FeaturePage>
            <MembershipCard> </MembershipCard>
        </div>
    );
};

export default Root;