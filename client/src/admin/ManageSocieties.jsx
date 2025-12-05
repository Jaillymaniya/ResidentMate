import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Chip,
  CircularProgress,
  Divider
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Home as HomeIcon,
  LocationCity as CityIcon,
  Map as MapIcon,
  Streetview as StreetIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from "@mui/icons-material";

export default function ManageSocieties() {
  const [societies, setSocieties] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [societyToDelete, setSocietyToDelete] = useState(null);

  const [form, setForm] = useState({
    SocietyName: "",
    Area: "",
    City: "",
    State: "",
    Pincode: "",
  });

  // Add this with other state declarations
    const [formErrors, setFormErrors] = useState({
      SocietyName: "",
      Area: "",
      City: "",
      State: "",
      Pincode: "",
      totalStreets: "",
      streets: []
    });

  const [totalStreets, setTotalStreets] = useState(0);
  const [streets, setStreets] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:5000/api/societies";

  const fetchSocieties = async () => {
    try {
      const res = await axios.get(API_URL);
      setSocieties(res.data);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to fetch societies", "error");
    }
  };

  useEffect(() => {
    fetchSocieties();
  }, []);

  // useEffect(() => {
  //   if (editingId && totalStreets > streets.length) {
  //     const newStreetsToAdd = totalStreets - streets.length;
  //     const newStreets = Array(totalStreets).fill().map((_, index) => ({
  //       streetNumber: `Street ${index + 1}`,
  //       streetArea: "",
  //       totalHome: "",
  //       homeArea: "",
  //       type: "2BHK",
  //     }));
  //     setStreets([...streets, ...newStreets]);
  //   } else if (!editingId) 
  //     {
  //       if (totalStreets > 0) {
  //         const newStreets = Array(totalStreets).fill().map((_, index) => ({
  //           streetNumber: `Street ${index + 1}`,
  //           streetArea: "",
  //           totalHome: "",
  //           homeArea: "",
  //           type: "2BHK",
  //         }));
  //         setStreets(newStreets);
  //       } else if (totalStreets === 0) {
  //         setStreets([]);
  //       }
  //     }
  //   }, [totalStreets, editingId]);

  // Separate useEffect for when editing starts
useEffect(() => {
  // This effect runs only when editingId changes
  if (editingId && streets.length > 0) {
    // When we're editing and streets are loaded, set totalStreets to match
    setTotalStreets(streets.length);
  }
}, [editingId, streets.length]);

// Separate effect for handling totalStreets changes
useEffect(() => {
  // Only handle totalStreets changes when NOT editing (for create mode)
  if (!editingId) {
    if (totalStreets > 0) {
      const newStreets = Array(totalStreets).fill().map((_, index) => ({
        streetNumber: `Street ${index + 1}`,
        streetArea: "",
        totalHome: "",
        homeArea: "",
        type: "2BHK",
      }));
      setStreets(newStreets);
    } else if (totalStreets === 0) {
      setStreets([]);
    }
  }
}, [totalStreets, editingId]);

  const showSnackbar = (message, severity = "success") => {
    if (severity === "error") {
      setErrorMsg(message);
    } else {
      setSuccessMsg(message);
    }
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  // Add this function after handleStreetChange function
  const validateForm = () => {
    const errors = {
      SocietyName: "",
      Area: "",
      City: "",
      State: "",
      Pincode: "",
      totalStreets: "",
      streets: Array(streets.length).fill({})
    };
    
    let isValid = true;

    // Society Name validation
    if (!editingId) {
      if (!form.SocietyName.trim()) {
        errors.SocietyName = "Society name is required";
        isValid = false;
      } else if (form.SocietyName.length < 3) {
        errors.SocietyName = "Society name must be at least 3 characters";
        isValid = false;
      }

      // Area validation
      if (!form.Area.trim()) {
        errors.Area = "Area is required";
        isValid = false;
      }

      // City validation
      if (!form.City.trim()) {
        errors.City = "City is required";
        isValid = false;
      } else if (!/^[A-Za-z\s]+$/.test(form.City)) {
        errors.City = "City must contain only letters";
        isValid = false;
      }

      // State validation (optional but validate if provided)
      if (form.State && !/^[A-Za-z\s]+$/.test(form.State)) {
        errors.State = "State must contain only letters";
        isValid = false;
      }

      // Pincode validation
      if (form.Pincode) {
        if (!/^\d{6}$/.test(form.Pincode)) {
          errors.Pincode = "Pincode must be exactly 6 digits";
          isValid = false;
        }
      }
    }

    // Total streets validation (for create mode)
    if (!editingId && totalStreets === 0) {
      errors.totalStreets = "Please enter number of streets";
      isValid = false;
    }



    // Street validation
    streets.forEach((street, index) => {
      const streetErrors = {};
      
      if (!street.streetNumber?.trim()) {
        streetErrors.streetNumber = "Street number is required";
        isValid = false;
      }
      
      if (!street.streetArea || street.streetArea <= 0) {
        streetErrors.streetArea = "Valid street area is required";
        isValid = false;
      }
      
      if (!street.totalHome || street.totalHome <= 0) {
        streetErrors.totalHome = "Valid home count is required";
        isValid = false;
      }
      
      errors.streets[index] = streetErrors;
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setForm(prev => ({ ...prev, [name]: value }));
  // };
  const handleChange = (e) => {
  const { name, value } = e.target;
  
  // Clear error for this field
  setFormErrors(prev => ({
    ...prev,
    [name]: ""
  }));
  
  setForm(prev => ({ ...prev, [name]: value }));
};

  const handleStreetChange = (index, field, value) => {
    const newStreets = [...streets];
    newStreets[index][field] = value;
    setStreets(newStreets);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!validateForm()) {
    showSnackbar("Please fix the validation errors", "error");
    return;
  }

    setLoading(true);

    try {
      const validStreets = streets
        .map(street => ({
          streetNumber: street.streetNumber,
          streetArea: parseFloat(street.streetArea),
          totalHome: parseInt(street.totalHome),
          type: street.type,
          homeArea: Math.round(parseFloat(street.streetArea) / parseInt(street.totalHome)),
        }))
        .filter(street =>
          street.streetNumber &&
          street.streetArea > 0 &&
          street.totalHome > 0
        );

      const submitData = {
        ...form,
        totalStreet: validStreets.length,
        streets: validStreets,
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, submitData);
        showSnackbar("Society updated successfully with streets!");
      } else {
        await axios.post(API_URL, submitData);
        showSnackbar("Society & streets created successfully!");
      }

      setForm({ SocietyName: "", Area: "", City: "", State: "", Pincode: "" });
      setTotalStreets(0);
      setStreets([]);
      setEditingId(null);
      await fetchSocieties();

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Something went wrong";
      showSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (soc) => {
    try {
      setErrorMsg("");
      setSuccessMsg("");
      setLoading(true);

      const res = await axios.get(`${API_URL}/${soc._id}`);
      const { society, streets: backendStreets } = res.data;

      setForm({
        SocietyName: society.SocietyName || "",
        Area: society.Area || "",
        City: society.City || "",
        State: society.State || "",
        Pincode: society.Pincode || "",
      });

      setEditingId(society._id);
      setTotalStreets(backendStreets.length);
      setStreets(
        backendStreets.map(st => ({
          streetNumber: st.streetNumber,
          streetArea: st.streetArea,
          totalHome: st.totalHome,
          homeArea: st.homeArea,
          type: st.type,
        }))
      );
      
      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      showSnackbar("Failed to load streets for this society", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setSocietyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/${societyToDelete}`);
      showSnackbar("Society deleted successfully!");
      await fetchSocieties();
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setDeleteDialogOpen(false);
      setSocietyToDelete(null);
    }
  };

  const handleCancelEdit = () => {
    setForm({ SocietyName: "", Area: "", City: "", State: "", Pincode: "" });
    setTotalStreets(0);
    setStreets([]);
    setEditingId(null);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#1a237e', display: 'flex', alignItems: 'center', gap: 1 }}>
              <HomeIcon fontSize="large" />
              Society Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage societies and their street details
            </Typography>
          </Box>
          <Chip 
            label={`${societies.length} Societies`} 
            color="primary" 
            variant="outlined"
            sx={{ fontSize: '1rem', padding: '8px 16px' }}
          />
        </Box>

        {/* Form Section */}
        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
          <CardHeader
            title={
              <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {editingId ? <EditIcon /> : <AddIcon />}
                {editingId ? "Edit Society" : "Add New Society"}
              </Typography>
            }
            subheader={editingId ? "Update society information and streets" : "Create a new society with street details"}
            sx={{ bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, color: '#1976d2', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CityIcon />
                  {/* Society Information */}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Society Name"
                      type="text"
                      name="SocietyName"
                      value={form.SocietyName}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      error={!!formErrors.SocietyName}
                      helperText={formErrors.SocietyName}
                      InputProps={{
                        readOnly: !!editingId, // Read-only when editing
                      }}
                      sx={{
                        '& .MuiInputBase-input.Mui-readOnly': {
                          backgroundColor: '#f5f5f5',
                          color: '#666',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Area"
                      name="Area"
                      value={form.Area}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      error={!!formErrors.Area}
                      helperText={formErrors.Area}
                      InputProps={{
                        readOnly: !!editingId,
                      }}
                      sx={{
                        '& .MuiInputBase-input.Mui-readOnly': {
                          backgroundColor: '#f5f5f5',
                          color: '#666',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="City"
                      name="City"
                      value={form.City}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      error={!!formErrors.City}
                      helperText={formErrors.City}
                      InputProps={{
                        readOnly: !!editingId,
                      }}
                      sx={{
                        '& .MuiInputBase-input.Mui-readOnly': {
                          backgroundColor: '#f5f5f5',
                          color: '#666',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="State"
                      name="State"
                      value={form.State}
                      onChange={handleChange}
                      variant="outlined"
                      error={!!formErrors.State}
                      helperText={formErrors.State}
                      InputProps={{
                        readOnly: !!editingId,
                      }}
                      sx={{
                        '& .MuiInputBase-input.Mui-readOnly': {
                          backgroundColor: '#f5f5f5',
                          color: '#666',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Pincode"
                      name="Pincode"
                      value={form.Pincode}
                      onChange={handleChange}
                      variant="outlined"
                      error={!!formErrors.Pincode}
                      helperText={formErrors.Pincode}
                      inputProps={{ 
                        maxLength: 6,
                        pattern: "[0-9]*"
                      }}
                      InputProps={{
                        readOnly: !!editingId,
                      }}
                      sx={{
                        '& .MuiInputBase-input.Mui-readOnly': {
                          backgroundColor: '#f5f5f5',
                          color: '#666',
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Total Streets Input (Create Mode Only) */}
              {/* {!editingId && ( */}
                <Box sx={{ mb: 4, p: 3, bgcolor: '#e3f2fd', borderRadius: 2, border: '1px dashed #ced9e5ff' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#125293ff', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StreetIcon />
                    Total Number of Streets
                  </Typography>
                  {/* <TextField
                    type="number"
                    label="Number of Streets"
                    value={totalStreets}
                    onChange={(e) => setTotalStreets(Math.max(0, parseInt(e.target.value) || 0))}
                    inputProps={{ min: 0, max: 40 }}
                    variant="outlined"
                    sx={{ width: 200 }}
                    helperText={formErrors.totalStreets || "Enter 1-25 streets"}
                    error={!!formErrors.totalStreets}
                    
                  /> */}
                  <TextField
  type="number"
  label="Number of Streets"
  value={totalStreets}
  onChange={(e) => {
    const newValue = Math.max(0, parseInt(e.target.value) || 0);
    
    if (editingId) {
      // When editing, handle street addition/removal manually
      if (newValue > totalStreets) {
        // Add new streets
        const streetsToAdd = newValue - totalStreets;
        const newStreets = Array(streetsToAdd).fill().map((_, index) => ({
          streetNumber: `Street ${streets.length + index + 1}`,
          streetArea: "",
          totalHome: "",
          homeArea: "",
          type: "2BHK",
        }));
        setStreets([...streets, ...newStreets]);
      } else if (newValue < totalStreets) {
        // Remove extra streets (keep first 'newValue' streets)
        setStreets(streets.slice(0, newValue));
      }
    }
    
    setTotalStreets(newValue);
    // Clear error when user starts typing
    setFormErrors(prev => ({
      ...prev,
      totalStreets: ""
    }));
  }}
  inputProps={{ min: 0, max: 40 }}
  variant="outlined"
  sx={{ width: 200 }}
  helperText={formErrors.totalStreets || "Enter 1-40 streets"}
  error={!!formErrors.totalStreets}
/>
                </Box>
              {/* )} */}

              {/* Street Forms */}
              {(totalStreets > 0 || editingId) && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 3, color: '#1976d2', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MapIcon />
                    Street Details ({totalStreets} streets)
                  </Typography>
                  <Grid container spacing={3}>
                    {streets.map((street, index) => (
                      <Grid item xs={12} key={index}>
                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Box sx={{
                                width: 40,
                                height: 40,
                                bgcolor: '#1976d2',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                mr: 2
                              }}>
                                {index + 1}
                              </Box>
                              <Typography variant="h6">Street {index + 1}</Typography>
                            </Box>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  fullWidth
                                  label="Street Number"
                                  value={street.streetNumber}
                                  onChange={(e) => handleStreetChange(index, "streetNumber", e.target.value)}
                                  required
                                  variant="outlined"
                                  size="small"
                                  error={!!(formErrors.streets?.[index]?.streetNumber)}
                                  helperText={formErrors.streets?.[index]?.streetNumber}
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  fullWidth
                                  type="number"
                                  label="Street Area (sq.ft)"
                                  value={street.streetArea}
                                  onChange={(e) => handleStreetChange(index, "streetArea", e.target.value)}
                                  required
                                  variant="outlined"
                                  size="small"
                                  error={!!(formErrors.streets?.[index]?.streetArea)}
                                  helperText={formErrors.streets?.[index]?.streetArea}
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  fullWidth
                                  type="number"
                                  label="Total Homes"
                                  value={street.totalHome}
                                  onChange={(e) => handleStreetChange(index, "totalHome", e.target.value)}
                                  required
                                  inputProps={{ min: 1 }}
                                  variant="outlined"
                                  size="small"
                                  error={!!(formErrors.streets?.[index]?.totalHome)}
                                  helperText={formErrors.streets?.[index]?.totalHome}
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  fullWidth
                                  select
                                  label="Home Type"
                                  value={street.type}
                                  onChange={(e) => handleStreetChange(index, "type", e.target.value)}
                                  variant="outlined"
                                  size="small"
                                  SelectProps={{
                                    native: true,
                                  }}
                                >
                                  <option value="1BHK">1BHK</option>
                                  <option value="2BHK">2BHK</option>
                                  <option value="3BHK">3BHK</option>
                                  <option value="4BHK">4BHK</option>
                                </TextField>
                              </Grid>
                            </Grid>
                            {street.streetArea && street.totalHome && (
                              <Alert 
                                severity="success" 
                                icon={<CheckCircleIcon />}
                                sx={{ mt: 2 }}
                              >
                                <Typography variant="body2">
                                  Home Area: <strong>{Math.round(parseFloat(street.streetArea) / parseInt(street.totalHome))} sq.ft/home</strong>
                                </Typography>
                              </Alert>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Form Actions */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                {editingId && (
                  <Button
                    variant="outlined"
                    onClick={handleCancelEdit}
                    startIcon={<CancelIcon />}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : (editingId ? <EditIcon /> : <AddIcon />)}
                  sx={{ minWidth: 200, backgroundColor: '#1a237e', '&:hover': { backgroundColor: '#1565c0', } }}
                >
                  {loading ? "Saving..." : (editingId ? "Update Society" : "Create Society")}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>

        {/* Societies Table */}
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardHeader
            title={
              <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HomeIcon />
                All Societies
              </Typography>
            }
            subheader={`Total: ${societies.length} societies`}
            sx={{ bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}
          />
          <CardContent>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                  <TableRow>
                    <TableCell><strong>Society Name</strong></TableCell>
                    <TableCell><strong>Area</strong></TableCell>
                    <TableCell><strong>City</strong></TableCell>
                    <TableCell><strong>State</strong></TableCell>
                    <TableCell><strong>Streets</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {societies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No societies found. Create your first society above.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    societies.map((society) => (
                      <React.Fragment key={society._id}>
                        <TableRow hover>
                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {society.SocietyName}
                            </Typography>
                          </TableCell>
                          <TableCell>{society.Area}</TableCell>
                          <TableCell>{society.City}</TableCell>
                          <TableCell>{society.State || "-"}</TableCell>
                          <TableCell>
                            <Chip 
                              label={`${society.streets?.length || 0} streets`} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton
                                color="primary"
                                onClick={() => handleEdit(society)}
                                size="small"
                                title="Edit"
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteClick(society._id)}
                                size="small"
                                title="Delete"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                        
                        {/* Street Details Row */}
                        {society.streets && society.streets.length > 0 && (
                          <TableRow sx={{ bgcolor: '#fafafa' }}>
                            <TableCell colSpan={6} sx={{ py: 2, px: 3 }}>
                              <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 500 }}>
                                Street Details:
                              </Typography>
                              <Table size="small" sx={{ bgcolor: 'white' }}>
                                <TableHead>
                                  <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                                    <TableCell><strong>Street Number</strong></TableCell>
                                    <TableCell><strong>Area (sq.ft)</strong></TableCell>
                                    <TableCell><strong>Total Homes</strong></TableCell>
                                    <TableCell><strong>Type</strong></TableCell>
                                    <TableCell><strong>Home Area</strong></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {society.streets.map((street) => (
                                    <TableRow key={street._id} hover>
                                      <TableCell>{street.streetNumber}</TableCell>
                                      <TableCell>{street.streetArea}</TableCell>
                                      <TableCell>{street.totalHome}</TableCell>
                                      <TableCell>{street.type}</TableCell>
                                      <TableCell>
                                        {street.homeArea ? `${street.homeArea} sq.ft` : "-"}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this society? This action will also delete all associated streets and cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarSeverity === 'success' ? successMsg : errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}