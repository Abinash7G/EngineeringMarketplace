// // import React from "react";
// // import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box } from "@mui/material";
// // import { Home, ShoppingCart, Favorite, AccountCircle, Logout, UploadFile, Close } from "@mui/icons-material";
// // import { useNavigate } from "react-router-dom";

// // const ClientSidebar = ({ open, onClose }) => {
// //   const navigate = useNavigate();

// //   const menuItems = [
// //     { text: "Dashboard", icon: <Home />, path: "/client" },
// //     { text: "Cart", icon: <ShoppingCart />, path: "/client/cart" },
// //     { text: "Wishlist", icon: <Favorite />, path: "/client/wishlist" },
// //     { text: "Profile", icon: <AccountCircle />, path: "/client/client-profile" },
// //     { text: "Rental Security Form", icon: <UploadFile />, path: "/upload-kyc" },
// //   ];

// //   return (
// //     <Drawer anchor="left" open={open} onClose={onClose}>
// //       <Box sx={{ width: 250, padding: 2 }}>
// //         {/* Close Button */}
// //         <ListItem button onClick={onClose} sx={{ justifyContent: "flex-end" }}>
// //           <ListItemIcon><Close /></ListItemIcon>
// //         </ListItem>
        
// //         <List>
// //           {menuItems.map((item, index) => (
// //             <ListItem button key={index} onClick={() => { navigate(item.path); onClose(); }}>
// //               <ListItemIcon>{item.icon}</ListItemIcon>
// //               <ListItemText primary={item.text} />
// //             </ListItem>
// //           ))}
// //         </List>
// //         <Divider />
// //         <List>
// //           <ListItem button onClick={() => navigate("/")}>
// //             <ListItemIcon><Logout /></ListItemIcon>
// //             <ListItemText primary="Logout" />
// //           </ListItem>
// //         </List>
// //       </Box>
// //     </Drawer>
// //   );
// // };

// // export default ClientSidebar;
// import React from "react";
// import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box } from "@mui/material";
// import { Home, ShoppingCart, Favorite, AccountCircle, Logout, UploadFile, Close, Gavel } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";

// const ClientSidebar = ({ open, onClose }) => {
//   const navigate = useNavigate();

//   const menuItems = [
//     { text: "Dashboard", icon: <Home />, path: "/client" },
//     { text: "Cart", icon: <ShoppingCart />, path: "/client/cart" },
//     { text: "Wishlist", icon: <Favorite />, path: "/client/wishlist" },
//     { text: "Profile", icon: <AccountCircle />, path: "/client/client-profile" },
//     { text: "Rental Security Form", icon: <UploadFile />, path: "/upload-kyc" },
//     { text: "Agreements", icon: <Gavel />, path: "/client/agreements" }, // Add Agreements tab
//   ];

//   return (
//     <Drawer anchor="left" open={open} onClose={onClose}>
//       <Box sx={{ width: 250, padding: 2 }}>
//         <ListItem button onClick={onClose} sx={{ justifyContent: "flex-end" }}>
//           <ListItemIcon><Close /></ListItemIcon>
//         </ListItem>
        
//         <List>
//           {menuItems.map((item, index) => (
//             <ListItem button key={index} onClick={() => { navigate(item.path); onClose(); }}>
//               <ListItemIcon>{item.icon}</ListItemIcon>
//               <ListItemText primary={item.text} />
//             </ListItem>
//           ))}
//         </List>
//         <Divider />
//         <List>
//           <ListItem button onClick={() => navigate("/")}>
//             <ListItemIcon><Logout /></ListItemIcon>
//             <ListItemText primary="Logout" />
//           </ListItem>
//         </List>
//       </Box>
//     </Drawer>
//   );
// };

// export default ClientSidebar;
import React from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box } from "@mui/material";
import { Home, ShoppingCart, Favorite, AccountCircle, Logout, UploadFile, Close, Gavel, Work } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ClientSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();

  const menuItems = [
    { text: "Dashboard", icon: <Home />, path: "/client" },
    { text: "Cart", icon: <ShoppingCart />, path: "/client/cart" },
    { text: "Wishlist", icon: <Favorite />, path: "/client/wishlist" },
    { text: "Profile", icon: <AccountCircle />, path: "/client/client-profile" },
    { text: "Rental Security Form", icon: <UploadFile />, path: "/upload-kyc" },
    { text: "Services Inquiry", icon: <Work />, path: "/client/clientservices" }, // Add Services tab
    { text: "Agreements", icon: <Gavel />, path: "/client/agreements" },
  ];

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 250, padding: 2 }}>
        <ListItem button onClick={onClose} sx={{ justifyContent: "flex-end" }}>
          <ListItemIcon><Close /></ListItemIcon>
        </ListItem>
        
        <List>
          {menuItems.map((item, index) => (
            <ListItem button key={index} onClick={() => { navigate(item.path); onClose(); }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem button onClick={() => navigate("/")}>
            <ListItemIcon><Logout /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default ClientSidebar;