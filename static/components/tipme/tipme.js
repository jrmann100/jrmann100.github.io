export default class TipMe extends HTMLElement {
  /**
   * @param {DocumentFragment | undefined} templateContent
   */
  constructor(templateContent) {
    super();
    if (templateContent === undefined) {
      throw new Error('Missing template content for tipme component, please register with HTML.');
    }
    const ethereum = /** @type {{ethereum?: unknown}} */ (window).ethereum;
    if (
      typeof ethereum !== 'object' ||
      ethereum === null ||
      !('request' in ethereum) ||
      typeof ethereum.request !== 'function'
    ) {
      return;
    }
    this.replaceChildren(templateContent);
    const button = this.querySelector('button');
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('Could not find button element for tipme component');
    }
    const request = ethereum.request;
    button.addEventListener('click', async () => {
      button.disabled = true;
      try {
        const account = (await request({ method: 'eth_requestAccounts' }))?.[0];
        if (account === undefined) {
          throw new Error('No account provided!');
        }
        try {
          await request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x2105',
                chainName: 'Base Mainnet',
                rpcUrls: ['https://mainnet.base.org'],
                nativeCurrency: {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18
                },
                blockExplorerUrls: ['https://basescan.org']
              }
            ]
          });
        } catch (error) {
          console.error('Switching to Base Mainnet failed with error', error);
        }
        await request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: account,
              to: '0xDEBCf6DF0Fa7A2A0Af2BE86731D06d2f13191eda',
              value: `0x${(1e15).toString(16)}`
            }
          ]
        });
        button.textContent = 'thanks';
      } catch (error) {
        console.error('Tipping failed with error', error);
        button.textContent = 'error';
      } finally {
        button.disabled = false;
      }
    });
  }
}
