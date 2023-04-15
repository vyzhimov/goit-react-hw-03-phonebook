import React, { Component } from 'react';
import { nanoid } from 'nanoid';
import Notiflix from 'notiflix';

import ContactForm from 'components/contactForm';
import ContactsList from 'components/contactsList';
import Filter from 'components/filter';
import {
  AppWrapper,
  Title,
  PhoneBookSection,
  ContactSection,
} from './App.styled';

export default class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  addContact = ({ name, number }) => {
    const contact = {
      id: nanoid(),
      name,
      number,
    };

    if (
      this.state.contacts.some(
        ({ name }) => name.toLowerCase() === contact.name.toLowerCase()
      )
    ) {
      Notiflix.Report.failure(
        'Sorry!',
        `${contact.name} is already in contacts`,
        'close',
        { width: '220px' }
      );
      return;
    }

    this.setState(({ contacts }) => ({
      contacts: [...contacts, contact],
    }));
  };

  onDeleteContact = id => {
    this.setState(({ contacts }) => ({
      contacts: contacts.filter(contact => contact.id !== id),
    }));
  };

  handleChangeFilter = event => {
    this.setState({ filter: event.currentTarget.value });
  };

  componentDidMount() {
    const contacts = JSON.parse(localStorage.getItem('contacts'));
    if (contacts) {
      this.setState({ contacts: contacts });
    }
  }

  componentDidUpdate(prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  render() {
    const { filter } = this.state;
    const { addContact, handleChangeFilter, onDeleteContact } = this;

    const normilizedFilter = this.state.filter.toLocaleLowerCase();
    const filteredContacts = this.state.contacts.filter(
      contact =>
        contact.name.toLocaleLowerCase().includes(normilizedFilter) ||
        contact.number.toLocaleLowerCase().includes(normilizedFilter)
    );

    return (
      <AppWrapper>
        <PhoneBookSection>
          <Title>PhoneBook</Title>
          <ContactForm onSubmit={addContact} />
        </PhoneBookSection>

        <ContactSection>
          <Title>Contacts</Title>
          <Filter value={filter} onChange={handleChangeFilter} />
          <ContactsList
            contacts={filteredContacts}
            deleteContact={onDeleteContact}
          />
        </ContactSection>
      </AppWrapper>
    );
  }
}
