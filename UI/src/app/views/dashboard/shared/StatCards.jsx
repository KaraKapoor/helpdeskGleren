import { Box, Card, Grid, Icon, IconButton, styled, Tooltip } from '@mui/material';
import { Small } from 'app/components/Typography';
import { Link } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '24px !important',
  background: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: { padding: '16px !important' },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  '& small': { color: theme.palette.text.secondary },
  '& .icon': { opacity: 0.6, fontSize: '44px', color: theme.palette.primary.main },
}));

const Heading = styled('h6')(({ theme }) => ({
  margin: 0,
  marginTop: '4px',
  fontSize: '14px',
  fontWeight: '500',
  color: theme.palette.primary.main,
}));

const StatCards = ({ data }) => {
  const cardList = [
    { name: `Assigned Tickets`, value: data?.assignedTicketsCount, icon: 'assignment' },
    { name: `Blocker/Critical Tickets Assigned`, value: data?.assignedBlockerTicketCount, icon: 'block' },
    { name: `Tickets Resolved By Me`, value: data?.resolvedTicketCount, icon: 'work' },
    { name: `Tickets Reviewed By Me`, value: data?.reviewedTicketCount, icon: 'rate_review' },
    { name: `Tickets Tested By Me`, value: data?.testedTicketCount, icon: 'bug_report' },
    { name: `Tickets Created By Me`, value: data?.totalTicketCreatedCount, icon: 'create' },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: '24px' }}>
      {cardList.map((item, index) => (
        <Grid item xs={12} md={6} key={index}>
          <StyledCard elevation={6}>
            <ContentBox>
              <Icon className="icon">{item.icon}</Icon>
              <Box ml="12px">
                <Small>{item.name}</Small>
                <Heading>{item.value}</Heading>
              </Box>
            </ContentBox>

            <Link to='/all-tickets'>
              <Tooltip title="View Details" placement="top">
                <IconButton>
                  <Icon>arrow_right_alt</Icon>
                </IconButton>
              </Tooltip>
            </Link>

          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatCards;
