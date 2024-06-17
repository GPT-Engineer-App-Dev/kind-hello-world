import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, Table, Tbody, Td, Th, Thead, Tr, VStack, useToast } from '@chakra-ui/react';
import { useEvents, useAddEvent, useUpdateEvent, useDeleteEvent, useVenues } from '../integrations/supabase/index.js';

const Events = () => {
  const { data: events, isLoading, error } = useEvents();
  const { data: venues } = useVenues();
  const addEvent = useAddEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const toast = useToast();

  const [formState, setFormState] = useState({ id: null, name: '', date: '', venue: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formState.id) {
        await updateEvent.mutateAsync(formState);
        toast({ title: 'Event updated.', status: 'success' });
      } else {
        await addEvent.mutateAsync(formState);
        toast({ title: 'Event added.', status: 'success' });
      }
      setFormState({ id: null, name: '', date: '', venue: '' });
    } catch (error) {
      toast({ title: 'Error occurred.', description: error.message, status: 'error' });
    }
  };

  const handleEdit = (event) => {
    setFormState(event);
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent.mutateAsync(id);
      toast({ title: 'Event deleted.', status: 'success' });
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
            <FormLabel>Date</FormLabel>
            <Input name="date" type="date" value={formState.date} onChange={handleChange} required />
          </FormControl>
          <FormControl>
            <FormLabel>Venue</FormLabel>
            <Select name="venue" value={formState.venue} onChange={handleChange} required>
              <option value="">Select venue</option>
              {venues && venues.map((venue) => (
                <option key={venue.id} value={venue.id}>{venue.name}</option>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" colorScheme="blue">{formState.id ? 'Update' : 'Add'} Event</Button>
        </VStack>
      </form>
      <Table mt={8}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Date</Th>
            <Th>Venue</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {events.map((event) => (
            <Tr key={event.id}>
              <Td>{event.name}</Td>
              <Td>{event.date}</Td>
              <Td>{venues.find((venue) => venue.id === event.venue)?.name}</Td>
              <Td>
                <Button size="sm" onClick={() => handleEdit(event)}>Edit</Button>
                <Button size="sm" colorScheme="red" onClick={() => handleDelete(event.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Events;