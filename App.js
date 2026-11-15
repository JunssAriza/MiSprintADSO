import { useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {FlatList,Pressable,SafeAreaView,StyleSheet,Text,TextInput,View,} from 'react-native';
import { useFonts, Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import { Roboto_700Bold } from '@expo-google-fonts/roboto';

const CATEGORIES = ['Análisis', 'Diseño', 'Código'];

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Roboto_700Bold,
  });
  const [title, setTitle] = useState('');
  const [learnerName, setLearnerName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [warning, setWarning] = useState('');
  const nextTaskId = useRef(1);

  if (!fontsLoaded) {
    return null;
  }

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  const addTask = () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setWarning('Escribe un título para poder agregar la tarea.');
      return;
    }

    if (!selectedCategory) {
      setWarning('Selecciona una categoría para la tarea.');
      return;
    }

    setTasks((currentTasks) => [
      ...currentTasks,
      {
        id: nextTaskId.current++,
        title: trimmedTitle,
        category: selectedCategory,
        completed: false,
      },
    ]);
    setTitle('');
    setSelectedCategory(null);
    setWarning('');
  };

  const toggleTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
  };

  const renderTask = ({ item }) => (
    <View style={[styles.taskCard, item.completed && styles.completedTaskCard]}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.completed }}
        accessibilityLabel={`Marcar ${item.title} como ${
          item.completed ? 'pendiente' : 'completada'
        }`}
        onPress={() => toggleTask(item.id)}
        style={styles.taskContent}
      >
        <View
          style={[
            styles.statusControl,
            item.completed && styles.statusControlCompleted,
          ]}
        >
          {item.completed ? <Text style={styles.checkmark}>✓</Text> : null}
        </View>
        <View style={styles.taskDetails}>
          <Text
            style={[styles.taskTitle, item.completed && styles.completedText]}
          >
            {item.title}
          </Text>
          <Text style={styles.taskCategory}>{item.category}</Text>
        </View>
        <Text
          style={[
            styles.statusLabel,
            item.completed && styles.completedStatusLabel,
          ]}
        >
          {item.completed ? 'Completada' : 'Pendiente'}
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Eliminar tarea ${item.title}`}
        onPress={() => deleteTask(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>Eliminar</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <FlatList
        data={tasks}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderTask}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <View style={styles.heading}>
                <Text style={styles.eyebrow}>TABLERO DE TRABAJO</Text>
                <Text style={styles.title}>Mi Sprint ADSO</Text>
                <TextInput
                  accessibilityLabel="Tu nombre"
                  value={learnerName}
                  onChangeText={setLearnerName}
                  placeholder="Escribe tu nombre"
                  placeholderTextColor="#8B95A5"
                  style={styles.nameInput}
                  returnKeyType="done"
                />
                <Text style={styles.welcome}>
                  {learnerName.trim()
                    ? `Hola, ${learnerName.trim()}`
                    : 'Personaliza tu tablero con tu nombre'}
                </Text>
                <Text style={styles.record}>Ficha 3409609</Text>
              </View>
              <View style={styles.headerMark}>
                <Text style={styles.headerMarkText}>ADSO</Text>
              </View>
            </View>

            <View style={styles.summary}>
              <SummaryCard label="Total" value={tasks.length} />
              <SummaryCard label="Pendientes" value={pendingCount} />
              <SummaryCard label="Completadas" value={completedCount} />
            </View>

            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Nueva tarea</Text>
              <Text style={styles.fieldLabel}>Título</Text>
              <TextInput
                accessibilityLabel="Título de la tarea"
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (warning) setWarning('');
                }}
                placeholder="¿Qué necesitas hacer?"
                placeholderTextColor="#8B95A5"
                style={styles.input}
                returnKeyType="done"
                onSubmitEditing={addTask}
              />

              <Text style={styles.fieldLabel}>Categoría</Text>
              <View style={styles.categories}>
                {CATEGORIES.map((category) => {
                  const isSelected = selectedCategory === category;
                  return (
                    <Pressable
                      key={category}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => {
                        setSelectedCategory(category);
                        setWarning('');
                      }}
                      style={[
                        styles.categoryButton,
                        isSelected && styles.categoryButtonSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          isSelected && styles.categoryTextSelected,
                        ]}
                      >
                        {category}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {warning ? (
                <Text accessibilityLiveRegion="polite" style={styles.warning}>
                  {warning}
                </Text>
              ) : null}
              <Pressable
                accessibilityRole="button"
                onPress={addTask}
                style={({ pressed }) => [
                  styles.addButton,
                  pressed && styles.addButtonPressed,
                ]}
              >
                <Text style={styles.addButtonText}>Agregar tarea</Text>
              </Pressable>
            </View>

            <View style={styles.listHeading}>
              <Text style={styles.sectionTitle}>Mis tareas</Text>
              <Text style={styles.taskCount}>{tasks.length}</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✓</Text>
            <Text style={styles.emptyTitle}>Aún no hay tareas</Text>
            <Text style={styles.emptyMessage}>
              Agrega tu primera actividad para organizar el sprint.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function SummaryCard({ label, value }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B1220',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  heading: {
    flex: 1,
  },
  eyebrow: {
    color: '#81D8C3',
    fontSize: 11,
    letterSpacing: 1.5,
    fontFamily: 'Roboto_700Bold',
    marginBottom: 7,
  },
  title: {
    color: '#F5F7FA',
    fontSize: 28,
    fontFamily: 'Roboto_700Bold',
  },
  welcome: {
    color: '#D5DCE7',
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    marginTop: 6,
  },
  nameInput: {
    minHeight: 40,
    maxWidth: 260,
    paddingHorizontal: 10,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#344258',
    backgroundColor: '#0F1725',
    color: '#F5F7FA',
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    marginTop: 10,
  },
  record: {
    color: '#9AA6B8',
    fontSize: 13,
    fontFamily: 'Montserrat_400Regular',
    marginTop: 4,
  },
  headerMark: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#183B43',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  headerMarkText: {
    color: '#81D8C3',
    fontSize: 12,
    fontFamily: 'Roboto_700Bold',
  },
  summary: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    minHeight: 78,
    marginHorizontal: 5,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: '#151F30',
    borderWidth: 1,
    borderColor: '#243146',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryValue: {
    color: '#F5F7FA',
    fontSize: 22,
    fontFamily: 'Roboto_700Bold',
  },
  summaryLabel: {
    color: '#AAB5C5',
    fontSize: 10,
    fontFamily: 'Montserrat_400Regular',
    marginTop: 4,
    textAlign: 'center',
  },
  formCard: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#151F30',
    borderWidth: 1,
    borderColor: '#243146',
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#F5F7FA',
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
  },
  fieldLabel: {
    color: '#D5DCE7',
    fontSize: 13,
    fontFamily: 'Montserrat_400Regular',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#344258',
    backgroundColor: '#0F1725',
    color: '#F5F7FA',
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
  },
  categories: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  categoryButton: {
    minHeight: 40,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#344258',
    backgroundColor: '#0F1725',
  },
  categoryButtonSelected: {
    borderColor: '#55C6A7',
    backgroundColor: '#173A39',
  },
  categoryText: {
    color: '#AAB5C5',
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
  },
  categoryTextSelected: {
    color: '#9AE6D1',
    fontFamily: 'Roboto_700Bold',
  },
  warning: {
    color: '#FFB7A7',
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    marginTop: 12,
  },
  addButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: '#4FC3A1',
    marginTop: 16,
  },
  addButtonPressed: {
    opacity: 0.8,
  },
  addButtonText: {
    color: '#0B201D',
    fontSize: 14,
    fontFamily: 'Roboto_700Bold',
  },
  listHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  taskCount: {
    color: '#AAB5C5',
    fontSize: 13,
    fontFamily: 'Montserrat_400Regular',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 28,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#344258',
    borderRadius: 16,
  },
  emptyIcon: {
    width: 38,
    height: 38,
    overflow: 'hidden',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 19,
    backgroundColor: '#183B43',
    color: '#81D8C3',
    fontSize: 21,
    fontFamily: 'Roboto_700Bold',
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#E8EDF4',
    fontSize: 15,
    fontFamily: 'Roboto_700Bold',
  },
  emptyMessage: {
    color: '#9AA6B8',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center',
    marginTop: 6,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: '#151F30',
    borderWidth: 1,
    borderColor: '#243146',
  },
  completedTaskCard: {
    borderColor: '#285047',
    backgroundColor: '#122824',
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  statusControl: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#77869B',
    marginRight: 10,
  },
  statusControlCompleted: {
    borderColor: '#4FC3A1',
    backgroundColor: '#4FC3A1',
  },
  checkmark: {
    color: '#0B201D',
    fontSize: 14,
    fontFamily: 'Roboto_700Bold',
  },
  taskDetails: {
    flex: 1,
    minWidth: 0,
  },
  taskTitle: {
    color: '#F0F3F8',
    fontSize: 13,
    fontFamily: 'Roboto_700Bold',
  },
  completedText: {
    color: '#9AA6B8',
    textDecorationLine: 'line-through',
  },
  taskCategory: {
    color: '#9AA6B8',
    fontSize: 11,
    fontFamily: 'Montserrat_400Regular',
    marginTop: 4,
  },
  statusLabel: {
    color: '#E6C978',
    fontSize: 10,
    fontFamily: 'Montserrat_400Regular',
    marginLeft: 8,
  },
  completedStatusLabel: {
    color: '#81D8C3',
  },
  deleteButton: {
    paddingVertical: 8,
    paddingLeft: 9,
    marginLeft: 5,
  },
  deleteButtonText: {
    color: '#FF9C91',
    fontSize: 11,
    fontFamily: 'Roboto_700Bold',
  },
});
