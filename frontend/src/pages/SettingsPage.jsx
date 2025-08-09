import { useState, useEffect } from 'react';
import { 
  Settings, 
  Key, 
  Download, 
  Trash2, 
  TestTube,
  FileText,
  Server,
  Shield,
  Copy,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import './App.css';

export default function SettingsPage() {
  const [logs, setLogs] = useState([]);
  const [newKeys, setNewKeys] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [cleanupDays, setCleanupDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const { authenticatedFetch, user } = useAuth();

  const fetchLogs = async () => {
    try {
      const response = await authenticatedFetch('/admin/logs?lines=100');
      if (response.ok) {
        const data = await response.json();
        setLogs(data.data.logs);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des logs');
    }
  };

  const generateKeys = async () => {
    setLoading(true);
    try {
      const response = await authenticatedFetch('/admin/generate-keys', {
        method: 'POST'
      });

      if (response.ok) {
        const data = await response.json();
        setNewKeys(data.data);
        toast.success('Nouvelles clés générées avec succès');
      } else {
        toast.error('Erreur lors de la génération des clés');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération des clés');
    } finally {
      setLoading(false);
    }
  };

  const testValidation = async () => {
    setLoading(true);
    try {
      const response = await authenticatedFetch('/admin/test-validation', {
        method: 'POST'
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult(data.data);
        toast.success('Test de validation effectué');
      } else {
        toast.error('Erreur lors du test de validation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du test de validation');
    } finally {
      setLoading(false);
    }
  };

  const cleanupData = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer les données de plus de ${cleanupDays} jours ?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await authenticatedFetch('/admin/cleanup', {
        method: 'POST',
        body: JSON.stringify({ days: cleanupDays })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Nettoyage effectué: ${data.data.deletedMetrics} métriques, ${data.data.deletedAnomalies} anomalies supprimées`);
      } else {
        const data = await response.json();
        toast.error(data.message || 'Erreur lors du nettoyage');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du nettoyage');
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      const response = await authenticatedFetch('/admin/export?format=json&days=30');
      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cdsec-validator-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Données exportées avec succès');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'export');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papiers');
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
          <p className="text-muted-foreground">
            Configuration et administration du nœud validateur
          </p>
        </div>
      </div>

      {/* Informations du nœud */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Informations du nœud
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>ID du nœud</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={user?.nodeId || 'N/A'} readOnly />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(user?.nodeId || '')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label>Organisation</Label>
              <Input value={user?.organization || 'N/A'} readOnly className="mt-1" />
            </div>
            <div>
              <Label>Utilisateur</Label>
              <Input value={user?.username || 'N/A'} readOnly className="mt-1" />
            </div>
            <div>
              <Label>Rôle</Label>
              <div className="mt-1">
                <Badge>{user?.role || 'N/A'}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets */}
      <Tabs defaultValue="security" className="space-y-4">
        <TabsList>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        {/* Sécurité */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Gestion des clés Ed25519
              </CardTitle>
              <CardDescription>
                Génération de nouvelles clés de signature pour le validateur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Attention :</strong> La génération de nouvelles clés invalidera toutes les signatures précédentes. 
                  Assurez-vous de mettre à jour la configuration avant de redémarrer le service.
                </p>
              </div>

              <Button onClick={generateKeys} disabled={loading}>
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Key className="h-4 w-4 mr-2" />
                )}
                Générer nouvelles clés
              </Button>

              {newKeys && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium text-red-600">Nouvelles clés générées</h4>
                  <div className="space-y-2">
                    <div>
                      <Label>Clé publique</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input value={newKeys.publicKey} readOnly className="font-mono text-xs" />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(newKeys.publicKey)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Clé privée</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input value={newKeys.secretKey} readOnly className="font-mono text-xs" />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(newKeys.secretKey)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-red-600">
                    {newKeys.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Test de validation
              </CardTitle>
              <CardDescription>
                Tester le système de validation avec un bloc de test
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testValidation} disabled={loading}>
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <TestTube className="h-4 w-4 mr-2" />
                )}
                Lancer test de validation
              </Button>

              {testResult && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium">Résultat du test</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Bloc de test</Label>
                      <ScrollArea className="h-32 mt-1">
                        <pre className="text-xs bg-background p-2 rounded">
                          {JSON.stringify(testResult.testBlock, null, 2)}
                        </pre>
                      </ScrollArea>
                    </div>
                    <div>
                      <Label>Résultat de validation</Label>
                      <ScrollArea className="h-32 mt-1">
                        <pre className="text-xs bg-background p-2 rounded">
                          {JSON.stringify(testResult.validationResult, null, 2)}
                        </pre>
                      </ScrollArea>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={testResult.validationResult.isValid ? "default" : "destructive"}>
                      {testResult.validationResult.isValid ? "Test réussi" : "Test échoué"}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance */}
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export des données
              </CardTitle>
              <CardDescription>
                Exporter les données de validation pour sauvegarde ou analyse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Exporter données (30 derniers jours)
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Nettoyage des données
              </CardTitle>
              <CardDescription>
                Supprimer les anciennes données pour libérer de l'espace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cleanup-days">Supprimer les données de plus de (jours)</Label>
                <Input
                  id="cleanup-days"
                  type="number"
                  min="1"
                  max="365"
                  value={cleanupDays}
                  onChange={(e) => setCleanupDays(parseInt(e.target.value))}
                  className="mt-1 w-32"
                />
              </div>
              
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  ⚠️ <strong>Attention :</strong> Cette action est irréversible. 
                  Les données supprimées ne pourront pas être récupérées.
                </p>
              </div>

              <Button 
                onClick={cleanupData} 
                disabled={loading}
                variant="destructive"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Nettoyer les données
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Logs système
              </CardTitle>
              <CardDescription>
                Derniers logs du système (100 dernières entrées)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground">
                  {logs.length} entrées de log
                </p>
                <Button onClick={fetchLogs} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
              </div>

              <ScrollArea className="h-96 border rounded-lg p-4">
                {logs.length > 0 ? (
                  <div className="space-y-2">
                    {logs.map((log, index) => (
                      <div key={index} className="text-xs font-mono p-2 rounded bg-muted/50">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant={
                              log.level === 'error' ? 'destructive' :
                              log.level === 'warn' ? 'secondary' :
                              'outline'
                            }
                            className="text-xs"
                          >
                            {log.level}
                          </Badge>
                          <span className="text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString('fr-FR')}
                          </span>
                        </div>
                        <div className="text-foreground">
                          {log.message}
                        </div>
                        {log.service && (
                          <div className="text-muted-foreground mt-1">
                            Service: {log.service}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Aucun log disponible
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

