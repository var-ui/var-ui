import { categoryLabels, componentRegistry } from '@/data/components';

export function ComponentIndex() {
  return (
    <>
      {Object.entries(categoryLabels).map(([category, label]) => {
        const components = componentRegistry.filter((entry) => entry.category === category);

        return (
          <section key={category} style={{ marginBlock: '2rem' }}>
            <h2 id={category}>{label}</h2>
            <table>
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {components.map((entry) => (
                  <tr key={entry.slug}>
                    <td>
                      <a href={`/components/${entry.slug}`}>{entry.name}</a>
                    </td>
                    <td>{entry.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      })}
    </>
  );
}
