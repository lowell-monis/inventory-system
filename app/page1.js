'use client';
import Image from "next/image";
import {useState, useEffect} from "react";
import {firestore} from "@/firebase";
import {Box, Modal, Button, Container, Grid, Typography, Stack, TextField} from "@mui/material";
import { collection, deleteDoc, getDocs, query, setDoc, getDoc, doc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()){
      const {quantity} = docSnap.data();
      await setDoc(docRef, {quantity: quantity + 1});
    }
    else{
      await setDoc(docRef, {quantity: 1});
    }

    await updateInventory();
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()){
      const {quantity} = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else{
        await setDoc(docRef, {quantity: quantity - 1});
      }
    }

    await updateInventory();
  }


  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
  <Box
    width="100vw"
    height="100vh"
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    gap={2}
  >
    <Modal
    open={open}
    onClose={handleClose}>
      <Box
        position={"absolute"}
        top={"50%"}
        left={"50%"}
        width={400}
        bgcolor={"white"}
        border={"2px solid black"}
        boxShadow={24}
        p={4}
        display="flex"
        flexDirection={"column"}
        gap={3}
        sx={{
          transform: "translate(-50%, -50%)"
        }}
      >
        <Typography variant="h6">Add Item</Typography>
        <Stack width={"100%"} direction={"row"} spacing={2}>
          <TextField 
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Button
          variant="outlined"
            onClick={() => {
              addItem(itemName);
              setItemName('');
              handleClose();
            }}
          >
            Add
          </Button>
        </Stack>  
      </Box>
    </Modal>
    <Button variant="contained" onClick={() => {
      handleOpen();
    }}>
      Add New Item
    </Button>
    <TextField
        variant="outlined"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ marginBottom: 2, width: '800px' }}
      />
    <Box border='3px solid black #333'>
      <Box width="800px" height="100px" bgcolor="#ADD8E6" alignItems="center" justifyContent="center" display="flex">
        <Typography variant="h4" color="#333">Inventory</Typography>
      </Box>
      <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {
            filteredInventory.length > 0 ? (
              filteredInventory.map(({ name, quantity }) => (
                <Box
                  key={name}
                  width="100%"
                  minHeight="150px"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  bgcolor={"#f0f0f0"}
                  padding={5}
                >
                  <Typography variant="h6" color="#333" textAlign="center">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="h6" color="#333" textAlign="center">
                    {quantity}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button variant="contained" onClick={() => addItem(name)}>Add</Button>
                    <Button variant="contained" onClick={() => removeItem(name)}>Remove</Button>
                  </Stack>
                </Box>
              ))
            ) : (
              <Typography variant="h6" color="#333" textAlign="center" padding={5}>
                No items found.
              </Typography>
            )
          }
        </Stack>
      </Box>
    </Box>
  );
}