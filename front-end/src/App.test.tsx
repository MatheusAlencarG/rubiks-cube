import React from 'react';
import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import GeneralConfigs from './Components/GeneralConfigs';
import GeneralConfigContext from './Contexts/GeneralConfigContext/GeneralConfigContext';

test('switches the interface language through settings', () => {
  render(
    <GeneralConfigContext>
      <GeneralConfigs />
    </GeneralConfigContext>
  );

  fireEvent.click(screen.getByAltText('Config Icon'));
  fireEvent.click(screen.getByText('idiomas'));
  fireEvent.click(screen.getByLabelText('English'));

  expect(screen.getByRole('heading', { name: 'configurations' })).toBeInTheDocument();
  expect(screen.getByLabelText('English')).toBeChecked();
  expect(screen.getByLabelText('Português')).not.toBeChecked();
});
