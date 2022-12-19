import { Card, Grid, styled, useTheme } from '@mui/material';
import { getDashboardData } from 'app/services/ticketService';
import { getProfilePic } from 'app/services/userService';
import { Fragment, useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Campaigns from './shared/Campaigns';
import DoughnutChart from './shared/Doughnut';
import RowCards from './shared/RowCards';
import StatCards from './shared/StatCards';
import StatCards2 from './shared/StatCards2';
import TopSellingTable from './shared/TopSellingTable';
import UpgradeCard from './shared/UpgradeCard';

const ContentBox = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
}));

const Title = styled('span')(() => ({
  fontSize: '1rem',
  fontWeight: '500',
  marginRight: '.5rem',
  textTransform: 'capitalize',
}));

const SubTitle = styled('span')(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
}));

const H4 = styled('h4')(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: '500',
  marginBottom: '16px',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary,
}));

const Analytics = () => {
  const { palette } = useTheme();
  let [searchParams] = useSearchParams();
  const searchdata = searchParams.get('updated')
  const [dashboardData, setDashboardData] = useState();
  useEffect(() => {
    fetchDashboardData()
  }, [])
  useEffect(()=>{
    if(searchdata){
      getProfilePic()
    }
  },[searchdata])
  const fetchDashboardData = () => {

    getDashboardData({}).then((response) => {
      setDashboardData(response?.data);
    })
  }

  return (
    <Fragment>
      <ContentBox className="analytics">
        <Grid container spacing={3}>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            <StatCards data={dashboardData} />
            {/* <TopSellingTable />
            <StatCards2 />

            <H4>Ongoing Projects</H4>
            <RowCards /> */}
          </Grid>

          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Card sx={{ px: 3, py: 2, mb: 3 }}>
              <Title>Your Tickets Statistics </Title>
              <DoughnutChart
                height="300px"
                color={[palette.primary.dark, '#FFAF38']}
                toDoTicketCount={dashboardData?.toDoTicketCount}
                inProgressTicketsCount={dashboardData?.inProgressTicketsCount}
              />
            </Card>

            <UpgradeCard />
            {/* <Campaigns /> */}
          </Grid>
        </Grid>
      </ContentBox>
    </Fragment>
  );
};

export default Analytics;
