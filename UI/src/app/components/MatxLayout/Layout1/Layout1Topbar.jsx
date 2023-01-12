import {
  Avatar,
  Fab,
  Hidden,
  Icon,
  IconButton,
  Input,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { Box, styled, useTheme } from "@mui/system";
import { MatxMenu, MatxSearchBox } from "app/components";
import { themeShadows } from "app/components/MatxTheme/themeColors";
import { NotificationProvider } from "app/contexts/NotificationContext";
import useAuth from "app/hooks/useAuth";
import useSettings from "app/hooks/useSettings";
import { topBarHeight } from "app/utils/constant";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Paragraph, Span } from "../../../components/Typography";
import NotificationBar from "../../NotificationBar/NotificationBar";
import ShoppingCart from "../../ShoppingCart";
import { fileUpload } from "app/services/ticketService";
import Swal from "sweetalert2";
import { getLoggedInUserDetails, getProfilePic, updateUserProfile} from "app/services/userService";
import axios from "axios";
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const TopbarRoot = styled("div")(({ theme }) => ({
  top: 0,
  zIndex: 96,
  transition: "all 0.3s ease",
  boxShadow: themeShadows[8],
  height: topBarHeight,
}));

const TopbarContainer = styled(Box)(({ theme }) => ({
  padding: "8px",
  paddingLeft: 18,
  paddingRight: 20,
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: theme.palette.primary.main,
  [theme.breakpoints.down("sm")]: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  [theme.breakpoints.down("xs")]: {
    paddingLeft: 14,
    paddingRight: 16,
  },  
}));

const UserMenu = styled(Box)(({theme}) => ({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  borderRadius: 24,
  padding: 4,
  "& span": { 
    margin: "0 8px",
    [theme.breakpoints.down("sm")]: {
      width:"auto",
      maxWidth:"150px",
      whiteSpace : 'nowrap',
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
  },
}));

const Profile = styled("Box")(({ theme }) => ({
  borderRadius: "50px",
  color: "#ffff",
  background: "#212943",
  width: "50px",
  height: "50px",
  lineHeight: 3,
  textAlign: "center",
  fontWeight: '700',
  textTransform:'uppercase',
  [theme.breakpoints.down("sm")]: {
    width: 50,
    height: 50,
    lineHeight: 3,
    textAlign: "center",
  },
  [theme.breakpoints.down("xs")]: {
    width: 50,
    height: 50,
    lineHeight: 3,
    textAlign: "center",
  },
  [theme.breakpoints.down("md")]: {
    width: 50,
    height: 50,
    lineHeight: 3,
    textAlign: "center",
  },
}));

const StyledItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  minWidth: 185,
  "& a": {
    width: "100%",
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  "& span": { marginRight: "10px", color: theme.palette.text.primary },
}));

const IconBox = styled("div")(({ theme }) => ({
  display: "inherit",
  [theme.breakpoints.down("md")]: { display: "none !important" },
}));

const Layout1Topbar = () => {
  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  const { logout, user } = useAuth();
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [users, setUsers] = useState({ avatar: "", raw: "" });
  const [UserDetails,SetUserDetails] = useState();
  let [searchParams] = useSearchParams();
  const searchdata = searchParams.get("updated");
  useEffect(() => {
    getProfilePic()
      .then((data) => {
        setUsers({...users,avatar:data?.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({
      layout1Settings: { leftSidebar: { ...sidebarSettings } },
    });
  };

  const handleSidebarToggle = () => {
    let { layout1Settings } = settings;
    let mode;
    if (isMdScreen) {
      mode = layout1Settings.leftSidebar.mode === "close" ? "mobile" : "close";
    } else {
      mode = layout1Settings.leftSidebar.mode === "full" ? "close" : "full";
    }
    updateSidebarMode({ mode });
  };
  const IMG = styled("img")(() => ({
    width: "100%",
    height: "auto",
  }));

  const LogoContainer = styled("div")(() => ({
    width: "260px",
    height: "40px",
  }));
useEffect(()=>{
  getLoggedInUserDetails().then((response)=>{
    SetUserDetails(response?.data)
  })
},[])
const intials =UserDetails?.first_name.charAt(0) + UserDetails?.last_name.charAt(0);

  return (
    <TopbarRoot>
      <TopbarContainer>
        <Box display="flex">
          {/* <StyledIconButton onClick={handleSidebarToggle}>
            <Icon>menu</Icon>
          </StyledIconButton> */}
          <IconBox>
            <StyledIconButton>
              <Link to="/create-ticket">
                <Fab
                  size="small"
                  color="secondary"
                  aria-label="Add"
                  className="button"
                >
                  <Icon>add</Icon>
                </Fab>
              </Link>
            </StyledIconButton>
            {/* <StyledIconButton>
              <Icon>mail_outline</Icon>
            </StyledIconButton>

            <StyledIconButton>
              <Icon>web_asset</Icon>
            </StyledIconButton>

            <StyledIconButton>
              <Icon>star_outline</Icon>
            </StyledIconButton> */}
          </IconBox>
        </Box>
        <LogoContainer>
          {/* <IMG src="/assets/modified/glerenLogo.png" alt="" className='mx-auto' /> */}
        </LogoContainer>

        <Box display="flex" alignItems="center">
          {/* <MatxSearchBox /> */}

          {/* <NotificationProvider>
            <NotificationBar />
          </NotificationProvider> */}

          <MatxMenu
            menuButton={
              <UserMenu>
                <Hidden xsDown>
                  <Span>
                    Hi,
                    &nbsp;
                    <strong>
                      {UserDetails?.first_name} {UserDetails?.last_name}
                    </strong>
                  </Span>
                </Hidden>
                <Profile>
                  <label htmlFor="upload-button"> 
                  {users.avatar ? (
                      <img
                        src={users?.avatar}
                        alt="avtar"
                        width="40"
                        height="40"
                        style={{ borderRadius: "50%" }}
                      /> 
                    ) : (
                      <>
                        {intials}
                      </>
                    )}
                  </label>
                </Profile>
              </UserMenu>
            }
          >
            <StyledItem>
              <Link to="/">
                <Icon> home </Icon>
                <Span> Home </Span>
              </Link>
            </StyledItem>

            <StyledItem>
              <Link to="/user-profile">
                <Icon> person </Icon>
                <Span> Profile </Span>
              </Link>
            </StyledItem>

            {/* <StyledItem>
              <Icon> settings </Icon>
              <Span> Settings </Span>
            </StyledItem> */}

            <StyledItem onClick={logout}>
              <Icon> power_settings_new </Icon>
              <Span> Logout </Span>
            </StyledItem>
          </MatxMenu>
        </Box>
      </TopbarContainer>
    </TopbarRoot>
  );
};

export default React.memo(Layout1Topbar);
