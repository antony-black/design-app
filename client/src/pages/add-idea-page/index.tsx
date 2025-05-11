import { useState } from 'react';
import { CustomInput } from '@/components/custom-input';
import { CustomTextArea } from '@/components/custom-textarea';
import { Segment } from '@/components/segment';
import type { TIdea } from '@/types/input-types';

const AddIdeaPage: React.FC = () => {
  const [value, setValue] = useState<TIdea>({
    name: '',
    nick: '',
    description: '',
    text: '',
  });

  return (
    <Segment title="New Idea">
      <CustomInput name="name" label="Name" value={value} setValue={setValue} />
      <CustomInput name="nick" label="Nick" value={value} setValue={setValue} />
      <CustomInput name="description" label="Description" value={value} setValue={setValue} />
      <CustomTextArea name="text" label="Text" value={value} setValue={setValue} />
      <button type="submit">Create Idea</button>
    </Segment>
  );
};

export default AddIdeaPage;
