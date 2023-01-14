/*global chrome*/
import { useState, useEffect } from 'react';
import { Flex, Text, Input, Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Select } from '@chakra-ui/react';

const configState = {
  apiKey: '',
  model: "text-davinci-003",
  maxTokens: 256,
};

function App() {
  const [models, setModels] = useState(["text-davinci-003"]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [config, setConfig] = useState(configState);

    const updateConfig = (e) => {
      setConfig({ ...config, [e.target.name]: e.target.value });

      chrome.storage.sync.set({ [e.target.name]: e.target.value });
    };

    const maxTokensSliderChange = (e) => {
      setConfig({ ...config, ["maxTokens"]: e });

      chrome.storage.sync.set({ ["maxTokens"]: e });
    }

    useEffect(() => {
        // Load all available models from GPT-3 API
        if (loaded) {
            fetch("https://api.openai.com/v1/models", {
                headers: {
                    Authorization: `Bearer ${config.apiKey}`,
                },
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.error) {
                        setLoggedIn(false);
                        return;
                    }
                    const model_ids = res.data.map((a) => a.id);
                    const sorted = model_ids.sort();
                    setModels(sorted);
                    setLoggedIn(true);
                });
        }
    }, [config.apiKey, loaded]);

    useEffect(() => {
        // Load config from chrome storage
        chrome.storage.sync.get(
            [
                "apiKey",
                "model",
                "maxTokens",
            ],
            (res) => {
                setConfig({
                    apiKey: res.apiKey || "",
                    model: res.model || "text-davinci-003",
                    maxTokens: res.maxTokens || 256,
                });
                setLoaded(true);
            }
        );
    }, []);
  return (
    <Flex direction="column" gap="2">
      <Text fontSize="lg" fontWeight="medium">GMAIL GPT-3</Text>
      <Text>API key:</Text>
      <Input name="apiKey" type="password" placeholder='Your OpenAI API key' onChange={updateConfig} value={config.apiKey} />
      
      {loggedIn && (
        <Flex direction="column" gap="2">
          <Text>Model:</Text>
          <Select name="model" placeholder='Select a model' onChange={updateConfig} value={config.model}>
            {models.map(model => <option value={model}>{model}</option>)}
          </Select>

          <Flex justify="space-between">
            <Text>Max tokens:</Text>
            <Input w="12" value={config.maxTokens} variant='unstyled' textAlign="right"/>
          </Flex>
          <Slider name="maxTokens" min={1} max={4000} value={config.maxTokens} onChange={maxTokensSliderChange}>
            <SliderTrack>
              <SliderFilledTrack bg='#FCC419' />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Flex>
      )
    }
    </Flex>
  );
}

export default App;
