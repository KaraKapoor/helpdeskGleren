import { Button, Card, styled } from '@mui/material';
import { convertHexToRGB } from 'app/utils/utils';
import { useNavigate } from "react-router-dom";
import { Strings } from 'config/strings';


const CardRoot = styled(Card)(({ theme }) => ({
  marginBottom: '24px',
  padding: '24px !important',
  [theme.breakpoints.down('sm')]: { paddingLeft: '16px !important' },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  position: 'relative',
  padding: '24px !important',
  background: `rgb(${convertHexToRGB(theme.palette.primary.main)}, 0.15) !important`,
  [theme.breakpoints.down('sm')]: { padding: '16px !important' },
}));

const Paragraph = styled('p')(({ theme }) => ({
  margin: 0,
  paddingTop: '24px',
  paddingBottom: '24px',
  color: theme.palette.text.secondary,
}));

const UpgradeCard = () => {
  const url = Strings.GLEREN_WEBSITE.concat(Strings.GLEREN_CONTACT_US_PATH);
  return (
    <CardRoot>
      <StyledCard elevation={0}>
        <img src="/assets/images/illustrations/upgrade.svg" alt="upgrade" />

        <Paragraph>
          Upgrade to <b>BASIC</b> OR <b> PREMIUM Plan</b>  for <br /> more features and unlimited user access
        </Paragraph>

        <Button
          size="large"
          color="primary"
          variant="contained"
          sx={{ textTransform: 'uppercase' }}
          onClick={() => window.open(url, '_blank')} 
        >
          upgrade now
        </Button>
      </StyledCard>
    </CardRoot>
  );
};

export default UpgradeCard;
