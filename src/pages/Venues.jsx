import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, Table, Tbody, Td, Th, Thead, Tr, VStack, useToast } from '@chakra-ui/react';
import { useVenues, useAddVenue, useUpdateVenue, useDeleteVenue } from '../integrations/supabase/index.js';

const Venues = () => {
  const { data: venues, isLoading, error } = useVenues();
  const addVenue = useAddVenue();
  const updateVenue = useUpdateVenue();
  const deleteVenue = useDeleteVenue();
  const toast = useToast();

  const [formState, setFormState] = useState({ id: null, name: '', capacity: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formState.id) {
        await updateVenue.mutateAsync(formState);
        toast({ title: 'Venue updated.', status: 'success' });
      } else {
        await addVenue.mutateAsync(formState);
        toast({ title: 'Venue added.', status: 'success' });
      }
      setFormState({ id: null, name: '', capacity: '', type: '' });
    } catch (error) {
      toast({ title: 'Error occurred.', description: error.message, status: 'error' });
    }
  };

  const handleEdit = (venue) => {
    setFormState(venue);
  };

  const handleDelete = async (id) => {
    try {
      await deleteVenue.mutateAsync(id);
      toast({ title: 'Venue deleted.', status: 'success' });
    } catch (error) {
      toast({ title: 'Error occurred.', description: error.message, status: 'error' });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input name="name" value={formState.name} onChange={handleChange} required />
          </FormControl>
          <FormControl>
            <FormLabel>Capacity</FormLabel>
            <Input name="capacity" type="number" value={formState.capacity} onChange={handleChange} required />
          </FormControl>
          <FormControl>
            <FormLabel>Type</FormLabel>
            <Select name="type" value={formState.type} onChange={handleChange} required>
              <option value="">Select type</option>
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </Select>
          </FormControl>
          <Button type="submit" colorScheme="blue">{formState.id ? 'Update' : 'Add'} Venue</Button>
        </VStack>
      </form>
      <Table mt={8}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Capacity</Th>
            <Th>Type</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {venues.map((venue) => (
            <Tr key={venue.id}>
              <Td>{venue.name}</Td>
              <Td>{venue.capacity}</Td>
              <Td>{venue.type}</Td>
              <Td>
                <Button size="sm" onClick={() => handleEdit(venue)}>Edit</Button>
                <Button size="sm" colorScheme="red" onClick={() => handleDelete(venue.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Venues;