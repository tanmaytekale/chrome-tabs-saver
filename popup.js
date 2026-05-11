document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById('save-btn');
  const nameInput = document.getElementById('session-name');
  const sessionsList = document.getElementById('sessions-list');
  const template = document.getElementById('session-template');

  // Load saved sessions on startup
  loadSessions();

  saveBtn.addEventListener('click', async () => {
    let sessionName = nameInput.value.trim();
    if (!sessionName) {
      sessionName = 'Unnamed Session';
    }

    try {
      // Get current window and its tabs
      const currentWindow = await chrome.windows.getCurrent({ populate: true });
      const tabs = currentWindow.tabs;

      // Extract relevant data
      const tabData = tabs.map(tab => ({
        url: tab.url,
        active: tab.active,
        pinned: tab.pinned,
        favIconUrl: tab.favIconUrl || null
      }));

      const session = {
        id: Date.now().toString(),
        name: sessionName,
        tabs: tabData,
        timestamp: Date.now(),
        tabCount: tabs.length
      };

      // Save to storage
      chrome.storage.local.get(['sessions'], (result) => {
        const sessions = result.sessions || [];
        sessions.push(session);
        chrome.storage.local.set({ sessions }, () => {
          nameInput.value = '';
          loadSessions();
          
          // Optional: Add a brief success animation to the button
          const originalText = saveBtn.textContent;
          saveBtn.textContent = 'Saved!';
          saveBtn.style.backgroundColor = '#10b981'; // emerald-500
          setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.backgroundColor = '';
          }, 1500);
        });
      });

    } catch (error) {
      console.error('Error saving session:', error);
      alert('Failed to save session.');
    }
  });

  function loadSessions() {
    chrome.storage.local.get(['sessions'], (result) => {
      const sessions = result.sessions || [];
      
      // Sort sessions by timestamp descending (newest first)
      sessions.sort((a, b) => b.timestamp - a.timestamp);
      
      sessionsList.innerHTML = '';
      
      if (sessions.length === 0) {
        sessionsList.innerHTML = '<p style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 20px 0;">No saved sessions yet.</p>';
        return;
      }

      sessions.forEach(session => {
        const clone = template.content.cloneNode(true);
        const item = clone.querySelector('.session-item');
        
        clone.querySelector('.session-title').textContent = session.name;
        
        const date = new Date(session.timestamp).toLocaleDateString(undefined, { 
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        clone.querySelector('.session-meta').textContent = `${session.tabCount} tabs • ${date}`;
        
        const faviconsContainer = clone.querySelector('.session-favicons');
        const MAX_FAVICONS = 8;
        
        session.tabs.slice(0, MAX_FAVICONS).forEach(tab => {
          if (tab.favIconUrl) {
            const img = document.createElement('img');
            img.src = tab.favIconUrl;
            img.title = tab.url; // Tooltip to see the URL
            
            // Handle broken favicons
            img.onerror = () => {
              img.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'favicon-placeholder';
              fallback.title = tab.url;
              faviconsContainer.appendChild(fallback);
            };
            faviconsContainer.appendChild(img);
          } else {
            // Fallback for missing favIconUrl
            const placeholder = document.createElement('div');
            placeholder.className = 'favicon-placeholder';
            placeholder.title = tab.url;
            faviconsContainer.appendChild(placeholder);
          }
        });

        if (session.tabs.length > MAX_FAVICONS) {
          const moreBadge = document.createElement('div');
          moreBadge.className = 'favicon-more';
          moreBadge.textContent = `+${session.tabs.length - MAX_FAVICONS}`;
          faviconsContainer.appendChild(moreBadge);
        }
        
        const restoreBtn = clone.querySelector('.restore-btn');
        restoreBtn.addEventListener('click', () => restoreSession(session));
        
        const deleteBtn = clone.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteSession(session.id));
        
        sessionsList.appendChild(clone);
      });
    });
  }

  async function restoreSession(session) {
    // Create an array of URLs
    // Filter out internal chrome:// extensions URLs that might be blocked
    const urls = session.tabs.map(tab => tab.url).filter(url => url && !url.startsWith('chrome-extension://'));
    
    if (urls.length === 0) {
       alert('No valid URLs to restore.');
       return;
    }

    // Create a new window with the URLs
    chrome.windows.create({ url: urls, focused: true }, (newWindow) => {
      // Optional: if we want to restore pinned states, we have to iterate through the newly created tabs.
      if (newWindow && newWindow.tabs) {
        session.tabs.forEach((savedTab, index) => {
          if (savedTab.pinned && index < newWindow.tabs.length) {
            chrome.tabs.update(newWindow.tabs[index].id, { pinned: true });
          }
        });
      }
    });
  }

  function deleteSession(sessionId) {
    chrome.storage.local.get(['sessions'], (result) => {
      let sessions = result.sessions || [];
      sessions = sessions.filter(s => s.id !== sessionId);
      chrome.storage.local.set({ sessions }, () => {
        loadSessions();
      });
    });
  }
});
